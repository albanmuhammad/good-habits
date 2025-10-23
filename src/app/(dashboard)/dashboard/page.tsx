import Link from 'next/link'
import HabitCard from '@/components/features/habits/HabitCard'
import { requireUser } from '@/lib/auth'
import { createClientFromRequest } from '@/lib/supabase/server'

export default async function Home() {
    const user = await requireUser()
    const supabase = await createClientFromRequest()

    const { data: habits } = await supabase
        .from('habits')
        .select('id, name, reminder_enabled, reminder_time, is_archived')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <main className="container py-8 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="section-title">Kebiasaannn</h1>
                <Link href="/habits/new" className="btn">+ Tambah</Link>
            </header>

            <section className="grid gap-3">
                {habits?.length ? habits.map(h => (
                    <HabitCard key={h.id} habit={h} />
                )) : (
                    <p className="text-neutral-500">Belum ada kebiasaan. Mulai dengan menambahkan satu.</p>
                )}
            </section>
        </main>
    )
}