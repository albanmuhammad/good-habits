// components/layout/Header/HeaderNav.tsx
"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Gift, LogOut, LogIn } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import { siteConfig } from "@/config/site"
import type { User } from "@/types/auth"

interface HeaderNavProps {
    user: User | null
    children: ReactNode
}

export function HeaderNav({ user, children }: HeaderNavProps) {
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await apiClient.post(API_ENDPOINTS.auth.logout)
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled
            ? 'border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-lg'
            : 'border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {children}

                <nav className="flex items-center gap-6 text-sm">
                    {!user ? (
                        <>
                            {siteConfig.navigation.marketing.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                                >
                                    {item.label}
                                </button>
                            ))}
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
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300/80 dark:border-neutral-700/80 px-4 py-2 font-medium bg-transparent hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}