// components/layout/Sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Target, Users, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/habits', label: 'Habits', icon: Target },
    { href: '/friends', label: 'Teman', icon: Users },
    { href: '/rewards', label: 'Reward', icon: Gift },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl min-h-screen sticky top-16">
            <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium",
                                isActive
                                    ? "bg-gradient-to-r from-neutral-800 to-neutral-900 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 shadow-md"
                                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}