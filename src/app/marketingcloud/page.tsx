import { Suspense } from "react";
import ConversionLandingClient from "./ConversionLandingClient";

export default function MarketingCloudPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-black text-white flex items-center justify-center">
                    <p className="text-sm text-zinc-400">Loading tracking page...</p>
                </main>
            }
        >
            <ConversionLandingClient />
        </Suspense>
    );
}
