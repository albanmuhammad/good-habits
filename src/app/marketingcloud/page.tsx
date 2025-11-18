"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type TrackingParams = {
    j?: string | null;
    sfmc_sub?: string | null;
    l?: string | null;
    u?: string | null;
    jb?: string | null;
    mid?: string | null;
};

const CONVERSION_PAGE_PATH = "/conversion"; // ubah jika perlu

export default function ConversionLandingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [trackingParams, setTrackingParams] = useState<TrackingParams>({});
    const [hasParams, setHasParams] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const params: TrackingParams = {
            j: searchParams.get("j"),
            sfmc_sub: searchParams.get("sfmc_sub"),
            l: searchParams.get("l"),
            u: searchParams.get("u"),
            jb: searchParams.get("jb"),
            mid: searchParams.get("mid"),
        };

        const hasAny =
            params.j ||
            params.sfmc_sub ||
            params.l ||
            params.u ||
            params.jb ||
            params.mid;

        setTrackingParams(params);
        setHasParams(!!hasAny);

        // Simpan ke cookie agar bisa diambil di halaman conversions page
        // Cookie name: sfmc_conv_tracking
        if (hasAny) {
            try {
                const cookieValue = encodeURIComponent(JSON.stringify(params));
                // Cookie 7 hari, bisa diubah
                document.cookie = `sfmc_conv_tracking=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 7
                    }`;
            } catch (e) {
                console.error("Failed to write tracking cookie", e);
            }
        }
    }, [searchParams]);

    const handleConfirm = () => {
        setIsSubmitting(true);

        // Teruskan parameter ke conversion page via query string
        const qp = new URLSearchParams();

        if (trackingParams.j) qp.set("j", trackingParams.j);
        if (trackingParams.sfmc_sub) qp.set("sfmc_sub", trackingParams.sfmc_sub);
        if (trackingParams.l) qp.set("l", trackingParams.l);
        if (trackingParams.u) qp.set("u", trackingParams.u);
        if (trackingParams.jb) qp.set("jb", trackingParams.jb);
        if (trackingParams.mid) qp.set("mid", trackingParams.mid);

        const url =
            qp.toString().length > 0
                ? `${CONVERSION_PAGE_PATH}?${qp.toString()}`
                : CONVERSION_PAGE_PATH;

        router.push(url);
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-lg w-full">
                <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 shadow-2xl px-8 py-10 overflow-hidden">
                    {/* Glow background */}
                    <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
                        <div className="absolute -top-40 -right-40 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-zinc-500/10 blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="relative space-y-6">
                        <header className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                Conversion Tracking
                            </p>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                                Konfirmasi Aksi Anda
                            </h1>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Halaman ini digunakan untuk melacak konversi dari email kampanye
                                Salesforce Marketing Cloud. Setelah Anda melanjutkan, kami akan
                                meneruskan informasi tracking ke halaman berikutnya.
                            </p>
                        </header>

                        {/* Info chip */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            {hasParams
                                ? "Parameter tracking ditemukan dan disimpan."
                                : "Tidak ada parameter tracking yang terdeteksi di URL."}
                        </div>

                        {/* Optional: tampilkan ringkas parameter (debug / transparansi) */}
                        <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-zinc-400 space-y-1">
                            <p className="font-medium text-zinc-200 mb-1">
                                Detail Tracking (opsional):
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>
                                    <span className="text-zinc-500">Job ID (j)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.j || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">Subscriber ID (sfmc_sub)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.sfmc_sub || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">List ID (l)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.l || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">Link ID (u)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.u || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">Batch ID (jb)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.jb || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">MID (mid)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.mid || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="w-full inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white text-black px-5 py-3 text-sm font-medium tracking-wide shadow-lg shadow-white/10 transition hover:bg-zinc-100 hover:shadow-xl hover:-translate-y-[1px] disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? "Memproses..." : "Konfirmasi & Lanjutkan"}
                            </button>
                        </div>

                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Dengan menekan tombol ini, Anda akan diarahkan ke halaman tujuan
                            (conversions page). Informasi tracking hanya digunakan untuk
                            mengukur performa kampanye dan tidak berisi data sensitif seperti
                            password.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
