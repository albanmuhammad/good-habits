// components/layout/Header/Header.tsx
import Link from "next/link"
import { getUser } from "@/lib/auth"
import { HeaderNav } from "./HeaderNav"
import { Sparkles } from "lucide-react"

export default async function Header() {
    const user = await getUser()

    return (
        <HeaderNav user={user}>
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent hover:from-neutral-700 hover:to-neutral-900 dark:hover:from-neutral-300 dark:hover:to-neutral-100 transition-all"
            >
                <Sparkles className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                Habit Tracker
            </Link>
        </HeaderNav>
    )
}