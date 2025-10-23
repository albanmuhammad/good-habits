// src/app/register/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [err, setErr] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    // track provider yang sedang dipakai biar bisa disable tombol
    const [oauthProvider, setOauthProvider] = useState<null | 'google' | 'facebook'>(null)

    const handleOAuth = async (provider: 'google' | 'facebook') => {
        setErr('')
        setMsg('')
        setOauthProvider(provider)

        const redirectTo =
            typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo }, // <- penting
        })
        if (error) {
            setErr(error.message)
            setOauthProvider(null)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErr('')
        setMsg('')

        if (!email || !password) {
            setErr('Email dan password wajib diisi.')
            return
        }
        if (password.length < 6) {
            setErr('Password minimal 6 karakter.')
            return
        }
        if (password !== confirm) {
            setErr('Konfirmasi password tidak cocok.')
            return
        }

        setLoading(true)

        const emailRedirectTo =
            typeof window !== 'undefined' ? `${window.location.origin}/` : undefined

        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo },
        })

        setLoading(false)

        // 1) Kalau ada error jelas dari Supabase
        if (error) {
            // Pesan khusus yang umum
            if (error.message.toLowerCase().includes('user already registered')) {
                setErr('Email sudah terdaftar. Silakan masuk.')
                return
            }
            setErr(error.message)
            return
        }

        // 2) Cara resmi mendeteksi “email sudah terdaftar” (tanpa error)
        //    identities.length === 0 -> user sudah ada
        const identities = data?.user?.identities ?? []
        if (identities.length === 0) {
            setErr('Email sudah terdaftar. Silakan masuk.')
            return
        }

        // 3) Jika email confirmation diaktifkan
        if (data?.user && !data.user?.confirmed_at) {
            setMsg('Akun dibuat. Cek email kamu untuk verifikasi.')
            return
        }

        // 4) Jika verifikasi dimatikan, user langsung login
        window.location.href = '/'
    }


    const isBusy = loading || !!oauthProvider

    return (
        <main className="container min-h-[90vh] grid place-items-center">
            <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5 p-4">
                <h1 className="text-2xl font-semibold">Daftar</h1>

                {err && <p className="text-red-600 text-sm">{err}</p>}
                {msg && <p className="text-green-600 text-sm">{msg}</p>}

                <div>
                    <label className="label">Email</label>
                    <Input
                        placeholder="kamu@contoh.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label className="label">Password</label>
                    <Input
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label className="label">Konfirmasi Password</label>
                    <Input
                        placeholder="******"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    variant="primary"
                    disabled={isBusy}
                    aria-busy={loading}
                >
                    {loading ? 'Memproses...' : 'Buat Akun'}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                    atau
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        type="button"
                        className="w-full btn"
                        disabled={isBusy}
                        onClick={() => handleOAuth('google')}
                        aria-busy={oauthProvider === 'google'}
                        title="Daftar dengan Google"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="-ms-1">
                            <path
                                d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.34-1.59 3.93-5.27 3.93-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.43l2.53-2.45C17.43 3.8 15.57 3 13.16 3 7.99 3 3.8 7.18 3.8 12.16S7.99 21.3 13.16 21.3c7 0 8.33-5.92 8.33-8.54 0-.57-.06-1.03-.14-1.66z"
                                fill="currentColor"
                            />
                        </svg>
                        <span className="ms-1">
                            {oauthProvider === 'google' ? 'Mengarahkan...' : 'Google'}
                        </span>
                    </Button>

                    <Button
                        type="button"
                        className="w-full btn"
                        disabled={isBusy}
                        onClick={() => handleOAuth('facebook')}
                        aria-busy={oauthProvider === 'facebook'}
                        title="Daftar dengan Facebook"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="-ms-1">
                            <path
                                d="M13 22v-8h3l.5-4H13V8.1c0-1.1.36-1.85 2.02-1.85H17V2.6c-.35-.05-1.56-.15-2.97-.15C10.7 2.45 9 4.02 9 7.05V10H6v4h3v8h4z"
                                fill="currentColor"
                            />
                        </svg>
                        <span className="ms-1">
                            {oauthProvider === 'facebook' ? 'Mengarahkan...' : 'Facebook'}
                        </span>
                    </Button>
                </div>

                <p className="text-sm text-neutral-500">
                    Sudah punya akun? <Link className="link" href="/login">Masuk</Link>
                </p>
            </form>
        </main>
    )
}
