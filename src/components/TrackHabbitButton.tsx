// components/TrackHabitButton.tsx
"use client"

import { useState, useEffect } from 'react'
import { trackHabitCompleted, isSalesforceLoaded } from '@/lib/salesforce-tracking'

type Props = {
    habitId: string
    habitName: string
    userId: string
    variant?: 'primary' | 'secondary' | 'minimal'
}

export default function TrackHabitButton({
    habitId,
    habitName,
    userId,
    variant = 'secondary'
}: Props) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [sfLoaded, setSfLoaded] = useState(false)

    useEffect(() => {
        const t = setInterval(() => {
            const loaded = isSalesforceLoaded()
            setSfLoaded(loaded)

            if (loaded && window.SalesforceInteractions?.getConsents) {
                const consents = window.SalesforceInteractions.getConsents()
                console.debug('[SF] consents:', consents)
            }
        }, 1500)

        return () => clearInterval(t)
    }, [])

    const handleTrack = async () => {
        setLoading(true)
        setMessage('')
        setSuccess(false)

        if (!sfLoaded) {
            setMessage('⏳ Salesforce Data Cloud belum siap. Tunggu sebentar...')
            setLoading(false)
            return
        }

        try {
            const result = trackHabitCompleted({
                habitId,
                habitName,
                userId,
            })

            if (result) {
                setSuccess(true)
                setMessage('✓ Event berhasil dikirim!')

                setTimeout(() => {
                    setMessage('')
                    setSuccess(false)
                }, 3000)
            } else {
                throw new Error('Gagal mengirim event')
            }
        } catch (error) {
            setMessage('✗ Gagal kirim event. Cek console untuk detail.')
            console.error('Track error:', error)
        } finally {
            setLoading(false)
        }
    }

    const buttonClass = {
        primary: 'btn',
        secondary: 'btn-secondary',
        minimal: 'text-sm text-blue-600 hover:text-blue-800 underline',
    }[variant]

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleTrack}
                disabled={loading || !sfLoaded}
                className={`${buttonClass} ${loading || !sfLoaded ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                title={!sfLoaded ? 'Menunggu Salesforce...' : 'Track event ke Data Cloud'}
            >
                {loading
                    ? '⏳ Tracking...'
                    : sfLoaded
                        ? '📊 Track to Data Cloud'
                        : '⏳ Loading SF...'}
            </button>

            {message && (
                <p className={`text-sm ${success ? 'text-green-600' : 'text-amber-600'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
