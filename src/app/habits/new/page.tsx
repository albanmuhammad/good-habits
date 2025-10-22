'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

export default function NewHabit() {
    const [name, setName] = useState('')
    const [reminder, setReminder] = useState(false)
    const [time, setTime] = useState('07:00')
    const [err, setErr] = useState('')

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { error } = await supabase.from('habits').insert({ owner_id: user.id, name, reminder_enabled: reminder, reminder_time: reminder ? time : null })
        if (error) setErr(error.message)
        else window.location.href = '/'
    }

    return (
        <main className="container py-8">
            <form onSubmit={submit} className="card space-y-4">
                <h1 className="section-title">Tambah Kebiasaan</h1>
                {err && <p className="text-red-600 text-sm">{err}</p>}
                <div>
                    <label className="label">Nama Kebiasaan</label>
                    <Input placeholder="Contoh: Baca 10 halaman" value={name} onChange={e => setName(e.target.value)}></Input>
                </div>
                <label className="flex items-center gap-3"><input type="checkbox" checked={reminder} onChange={e => setReminder(e.target.checked)} />Aktifkan Reminder</label>
                {reminder && (
                    <div>
                        <label className="label">Jam</label>
                        <Input type="time" value={time} onChange={e => setTime(e.target.value)}></Input>
                    </div>
                )}
                <Button variant="primary">Simpan</Button>
            </form>
        </main>
    )
}