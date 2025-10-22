import HabitChart from "@/components/ui/HabitChart";
import { getUser, requireUser } from "@/lib/auth";
import { createClientFromRequest } from "@/lib/supabase/server";

export default async function HabitDetail({ params }: { params: { id: string } }) {
    const user = await requireUser()
    const supabase = createClientFromRequest()

    const [{ data: habit }, { data: logs }] = await Promise.all([
        (await supabase).from('habits').select('*').eq('id', params.id).single(),
        (await supabase).from('habit_logs').select('occured_on, quanitity').eq('habit_id', params.id).order('occured_on', { ascending: true })
    ])

    async function addToday() {
        'use server'
        const user = await requireUser()
        const supabase = await createClientFromRequest()
        const today = new Date().toISOString().slice(0, 10)

        await supabase
            .from('habits_logs')
            .insert({
                habit_id: params.id,
                owner_id: user.id,
                occurred_on: today
            })
    }

    return (
        <main className="container py-8 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="section-title">{habit?.name}</h1>
                <form action={addToday}><button className="btn">Tandai Hari Ini</button></form>
            </header>
            <section className="card">
                <HabitChart data={(logs || []).map(l => ({ date: l.occured_on, value: l.quanitity }))} />
            </section>
        </main>
    )
}