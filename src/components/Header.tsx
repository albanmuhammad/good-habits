import Link from "next/link";
import { getUser, signOut } from "@/lib/auth";
import Button from "./ui/Button";

export default async function Header() {
    const user = await getUser()
    const navLinks = [
        { href: "/friends", label: "Teman", icon: "👥" },
        { href: "/rewards", label: "Reward", icon: "🎁" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200/50 dark:border-neutral-800/50 
                         bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm">
            <div className="container py-4 px-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 
                                         dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent
                                         hover:from-neutral-700 hover:to-neutral-900
                                         dark:hover:from-neutral-300 dark:hover:to-neutral-100 transition-all">
                    ✨ Habit Tracker
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                    <Link href="/friends"
                        className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 
                                   dark:hover:text-neutral-100 transition-colors font-medium">
                        👥 Teman
                    </Link>
                    <Link href="/rewards"
                        className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 
                                   dark:hover:text-neutral-100 transition-colors font-medium">
                        🎁 Reward
                    </Link>
                    {user ? (
                        <form action={signOut}>
                            <Button type="submit" className="px-3 py-2" aria-label="Keluar">
                                <span aria-hidden className="text-lg leading-none">🚪</span>
                                <span>Keluar</span>
                            </Button>
                        </form>
                    ) : (
                        <Link className="btn btn-primary" href="/login">
                            🔐 Masuk
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}