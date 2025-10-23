// components/layout/Footer.tsx
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 py-12 bg-white/50 dark:bg-neutral-900/50 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                        Habit Tracker
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        © 2025 Habit Tracker. Semua hak dilindungi.
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href="/about" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                            Tentang
                        </Link>
                        <Link href="/privacy" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                            Privasi
                        </Link>
                        <Link href="/contact" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                            Kontak
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}