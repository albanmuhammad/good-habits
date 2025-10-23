// app/(dashboard)/layout.tsx
import { requireUser } from "@/lib/auth"
import Header from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import type { ReactNode } from "react"

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    await requireUser() // Redirect if not authenticated

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}