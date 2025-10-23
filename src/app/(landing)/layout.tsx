// app/(marketing)/layout.tsx
import Header from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import type { ReactNode } from "react"

export default function MarketingLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}