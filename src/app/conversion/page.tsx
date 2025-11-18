// app/conversion/page.tsx
import { Suspense } from "react";
import ConversionPageClient from "./ConversionPageClient";

export default function ConversionPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-black text-white flex items-center justify-center">
                    <p className="text-sm text-zinc-400">Loading conversion page...</p>
                </main>
            }
        >
            <ConversionPageClient />
        </Suspense>
    );
}
