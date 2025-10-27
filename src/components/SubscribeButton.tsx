"use client";

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';

// Menerima prop 'user' yang kita dapatkan dari Server Component
type Props = {
    userEmail?: string;
    userName?: string;
}

export default function SubscribeButton({ userEmail, userName }: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubscribe = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Kita kirim email dan nama pengguna ke API route kita
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail, // Gunakan prop langsung
                    name: userName,   // Gunakan prop langsung
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan');
            }

            setMessage('Berhasil subscribe ke Marketing Cloud!');

        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Gagal subscribe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="btn-secondary" // Anda bisa ganti styling-nya
            >
                {loading ? 'Memproses...' : 'Sync ke Marketing Cloud'}
            </button>
            {message && <p className="text-sm text-neutral-500">{message}</p>}
        </div>
    );
}