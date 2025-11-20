import { Suspense } from "react";
import TrackingLandingClient from "./TrackingLandingClient";

export default function MarketingCloudPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-black text-white flex items-center justify-center">
                    <p className="text-sm text-zinc-400">Loading tracking page...</p>
                </main>
            }
        >
            <TrackingLandingClient />
        </Suspense>
    );
}
