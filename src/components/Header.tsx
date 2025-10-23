// components/Header.tsx
"use client";

import Link from "next/link";
import { getUser, signOut } from "@/lib/auth";
import Button from "./ui/Button";
import type { User } from "@/types/auth"
import { useEffect, useState } from "react";
import { Sparkles, Users, Gift, LogOut, LogIn } from "lucide-react";

interface HeaderProps {
    user: User | null
    signOut: () => Promise<void>
}

export default function Header({ user, signOut }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled
            ? 'border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-lg'
            : 'border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent hover:from-neutral-700 hover:to-neutral-900 dark:hover:from-neutral-300 dark:hover:to-neutral-100 transition-all"
                >
                    <Sparkles className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                    Habit Tracker
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    {!user ? (
                        <>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                            >
                                Fitur
                            </button>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                            >
                                Cara Kerja
                            </button>
                            <button
                                onClick={() => scrollToSection('testimonials')}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                            >
                                Testimoni
                            </button>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border-transparent bg-gradient-to-r from-neutral-800 to-neutral-900 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 px-5 py-2.5 font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                            >
                                <LogIn className="w-4 h-4" />
                                Masuk
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/friends"
                                className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                            >
                                <Users className="w-4 h-4" />
                                Teman
                            </Link>
                            <Link
                                href="/rewards"
                                className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                            >
                                <Gift className="w-4 h-4" />
                                Reward
                            </Link>
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300/80 dark:border-neutral-700/80 px-4 py-2 font-medium bg-transparent hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all duration-200 active:scale-95 shadow-sm"
                                    aria-label="Keluar"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Keluar</span>
                                </button>
                            </form>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
