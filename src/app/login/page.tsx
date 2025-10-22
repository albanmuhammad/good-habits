'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setErr(error.message)
        else window.location.href = '/'
        setLoading(false)
    }

    return (
        <main className="container min-h-[70vh] grid place-items-center">
            <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5 p-4">
                <h1 className="text-2xl font-semibold">Masuk</h1>
                {err && <p className="text-red-600 text-sm">{err}</p>}
                <div>
                    <label className="label">Email</label>
                    <Input placeholder="kamu@contoh.com" value={email} onChange={e => setEmail(e.target.value)}></Input>
                </div>
                <div>
                    <label className="label">Password</label>
                    <Input placeholder="******" value={password} onChange={e => setPassword(e.target.value)}></Input>
                </div>
                <Button className="w-full" variant="primary" disabled={loading}>{loading ? '...' : 'Masuk'}</Button>
                <p className="text-sm text-neutral-500">Belum punya akun? <Link className="link" href="#">Daftar</Link></p>
            </form>
        </main>
    )
}