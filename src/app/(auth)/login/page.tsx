'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { Provider } from '@supabase/supabase-js'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authService } from '@/services/auth/auth.service'
import { loginSchema } from '@/services/auth/auth.validator'

const OAUTH_PROVIDERS = ['google', 'facebook'] as const satisfies Provider[]

type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [oauthProvider, setOauthProvider] = useState<OAuthProvider | null>(null)

    const handleOAuth = async (provider: OAuthProvider) => {
        setErr('')
        setMessage('')
        setOauthProvider(provider)

        const redirectTo =
            typeof window !== 'undefined'
                ? `${window.location.origin}/auth/callback`
                : undefined

        const result = await authService.signInWithOAuth(provider, redirectTo)

        if (!result.success) {
            setErr(result.error)
        }

        setOauthProvider(null)
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErr('')
        setMessage('')

        const parsed = loginSchema.safeParse({ email, password })

        if (!parsed.success) {
            setErr(parsed.error.issues[0]?.message || 'Data tidak valid.')
            return
        }

        setLoading(true)

        const result = await authService.login(parsed.data)

        setLoading(false)

        if (!result.success) {
            setErr(result.error)
            return
        }

        setMessage(result.message ?? 'Berhasil masuk.')
        window.location.href = '/dashboard'
    }

    const isBusy = loading || !!oauthProvider

    return (
        <main className="container min-h-[90vh] grid place-items-center">
            <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5 p-4">
                <h1 className="text-2xl font-semibold">Masuk</h1>
                {err && <p className="text-red-600 text-sm">{err}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <div>
                    <label className="label">Email</label>
                    <Input
                        placeholder="kamu@contoh.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label className="label">Password</label>
                    <Input
                        placeholder="******"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        autoComplete="current-password"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    variant="primary"
                    disabled={isBusy}
                >
                    {loading ? 'Memproses...' : 'Masuk'}
                </Button>

                <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                    atau
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {OAUTH_PROVIDERS.map(provider => (
                        <Button
                            key={provider}
                            type="button"
                            className="w-full btn"
                            disabled={isBusy}
                            onClick={() => handleOAuth(provider)}
                            aria-busy={oauthProvider === provider}
                            title={`Masuk dengan ${provider.charAt(0).toUpperCase()}${provider.slice(1)}`}
                        >
                            {provider === 'google' ? (
                                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="-ms-1">
                                    <path
                                        d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.34-1.59 3.93-5.27 3.93-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.02.77 3.71 1.43l2.53-2.45C17.43 3.8 15.57 3 13.16 3 7.99 3 3.8 7.18 3.8 12.16S7.99 21.3 13.16 21.3c7 0 8.33-5.92 8.33-8.54 0-.57-.06-1.03-.14-1.66z"
                                        fill="currentColor"
                                    />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="-ms-1">
                                    <path
                                        d="M13 22v-8h3l.5-4H13V8.1c0-1.1.36-1.85 2.02-1.85H17V2.6c-.35-.05-1.56-.15-2.97-.15C10.7 2.45 9 4.02 9 7.05V10H6v4h3v8h4z"
                                        fill="currentColor"
                                    />
                                </svg>
                            )}
                            <span className="ms-1">
                                {oauthProvider === provider ? 'Mengarahkan...' : provider === 'google' ? 'Google' : 'Facebook'}
                            </span>
                        </Button>
                    ))}
                </div>

                <p className="text-sm text-neutral-500">
                    Belum punya akun? <Link className="link" href="/register">Daftar</Link>
                </p>
            </form>
        </main>
    )
}