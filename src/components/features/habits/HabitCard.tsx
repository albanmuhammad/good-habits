import Link from "next/link";

export default function HabitCard({ habit }: { habit: { id: string; name: string; reminder_enabled: boolean; reminder_time: string | null } }) {
    return (
        <Link href={`/habits/${habit.id}`} className="card flex items-center justify-between">
            <span className="font-medium">{habit.name}</span>
            <span className="text-cs text-neutral-500">{habit.reminder_enabled ? `⏰ ${habit.reminder_time ?? ''}` : '—'}</span>
        </Link>
    )
}