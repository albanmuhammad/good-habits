-- ===== Extensions (Supabase sudah aktifkan banyak ext secara default)
-- Pastikan pgcrypto tersedia untuk gen_random_uuid()
create extension if not exists pgcrypto;

-- ===== Profiles (mirror user info minimal)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- ===== Habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  frequency text not null default 'daily',               -- daily|weekly|custom
  target_per_period int not null default 1,              -- target per hari/minggu
  reminder_enabled boolean not null default false,
  reminder_time time,                                    -- jam lokal user (sinkronkan via timezone user)
  is_archived boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists idx_habits_owner on public.habits(owner_id);

-- ===== Habit Logs (cek-in harian)
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  occurred_on date not null,
  quantity int not null default 1,
  note text,
  created_at timestamptz default now(),
  unique (habit_id, occurred_on)
);
create index if not exists idx_logs_owner_date on public.habit_logs(owner_id, occurred_on);
create index if not exists idx_logs_habit_date on public.habit_logs(habit_id, occurred_on);

-- ===== Friendships
do $$ begin
  create type friendship_status as enum ('pending', 'accepted', 'blocked');
exception when duplicate_object then null; end $$;

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references auth.users(id) on delete cascade,
  addressee uuid not null references auth.users(id) on delete cascade,
  status friendship_status not null default 'pending',
  created_at timestamptz default now(),
  unique (requester, addressee)
);
create index if not exists idx_friends_requester on public.friendships(requester);
create index if not exists idx_friends_addressee on public.friendships(addressee);
create index if not exists idx_friends_status on public.friendships(status);

-- ===== Streak snapshots (denormalized)
create table if not exists public.habit_streaks (
  habit_id uuid primary key references public.habits(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_date date
);
create index if not exists idx_streaks_owner on public.habit_streaks(owner_id);

-- ===== Rewards (milestones)
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid references public.habits(id) on delete cascade,
  kind text not null,     -- e.g., 'tree_level', 'badge'
  level int not null default 1,
  unlocked_at timestamptz default now(),
  unique (owner_id, habit_id, kind, level)
);
create index if not exists idx_rewards_owner on public.rewards(owner_id);

-- ===== User settings (timezone & email opt-in)
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text default 'UTC',
  email_opt_in boolean not null default true
);

-- =========================================
-- RLS: aktifkan & policy ketat (owner-only)
-- =========================================
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.friendships enable row level security;
alter table public.habit_streaks enable row level security;
alter table public.rewards enable row level security;
alter table public.user_settings enable row level security;

-- Profiles
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select using (true);

drop policy if exists "profiles_self_rw" on public.profiles;
create policy "profiles_self_rw"
  on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- Habits
drop policy if exists "habits_owner_all" on public.habits;
create policy "habits_owner_all"
  on public.habits for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Habit Logs
drop policy if exists "logs_owner_all" on public.habit_logs;
create policy "logs_owner_all"
  on public.habit_logs for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Friendships: peserta bisa lihat, requester yang insert
drop policy if exists "friendships_participant_select" on public.friendships;
create policy "friendships_participant_select"
  on public.friendships for select
  using (auth.uid() = requester or auth.uid() = addressee);

drop policy if exists "friendships_insert_requester" on public.friendships;
create policy "friendships_insert_requester"
  on public.friendships for insert
  with check (auth.uid() = requester);

drop policy if exists "friendships_update_participant" on public.friendships;
create policy "friendships_update_participant"
  on public.friendships for update
  using (auth.uid() = requester or auth.uid() = addressee);

-- Streaks / Rewards / Settings: owner-only
drop policy if exists "streaks_owner_all" on public.habit_streaks;
create policy "streaks_owner_all"
  on public.habit_streaks for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "rewards_owner_all" on public.rewards;
create policy "rewards_owner_all"
  on public.rewards for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "settings_owner_all" on public.user_settings;
create policy "settings_owner_all"
  on public.user_settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================
-- Streak & Reward: trigger simple & cepat
-- =========================================

-- Helper: upsert streak row
create or replace function public.ensure_streak_row(p_habit uuid, p_owner uuid)
returns void language sql as $$
  insert into public.habit_streaks (habit_id, owner_id)
  values (p_habit, p_owner)
  on conflict (habit_id) do nothing;
$$;

-- Update streak saat insert log baru (tanpa scan mahal)
create or replace function public.update_streak_on_log()
returns trigger language plpgsql as $$
declare
  prev_date date;
  curr int;
  longest int;
begin
  perform public.ensure_streak_row(new.habit_id, new.owner_id);

  select last_date, current_streak, longest_streak
  into prev_date, curr, longest
  from public.habit_streaks
  where habit_id = new.habit_id
  for update;

  if prev_date is null then
    curr := 1;
  elsif new.occurred_on = prev_date then
    -- log duplikat tanggal sudah dicegah oleh UNIQUE, tapi jaga-jaga
    curr := curr;
  elsif new.occurred_on = prev_date + 1 then
    curr := curr + 1;
  else
    curr := 1;
  end if;

  longest := greatest(longest, curr);

  update public.habit_streaks
  set current_streak = curr,
      longest_streak = longest,
      last_date = greatest(coalesce(prev_date, new.occurred_on), new.occurred_on)
  where habit_id = new.habit_id;

  -- rewards sederhana di milestone
  if curr in (7, 30, 100, 365) then
    insert into public.rewards(owner_id, habit_id, kind, level)
    values (new.owner_id, new.habit_id, 'tree_level', curr)
    on conflict do nothing;
  end if;

  return new;
end; $$;

drop trigger if exists trg_log_after_insert on public.habit_logs;
create trigger trg_log_after_insert
  after insert on public.habit_logs
  for each row execute function public.update_streak_on_log();

-- =========================================
-- Indeks tambahan (kinerja)
-- =========================================
create index if not exists idx_habits_created_at on public.habits(created_at desc);
create index if not exists idx_logs_created_at on public.habit_logs(created_at desc);
