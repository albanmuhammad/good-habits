// app/conversion/ConversionPageClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type TrackingParams = {
    j?: string | null;        // job_id
    sfmc_sub?: string | null; // sub_id
    l?: string | null;        // list id
    u?: string | null;        // original_link_id
    jb?: string | null;       // BatchID
    mid?: string | null;      // member_id
};

// cookie name sama dengan yang dipakai di landing page
const TRACKING_COOKIE_NAME = "sfmc_conv_tracking";

// boleh kamu ganti dengan NEXT_PUBLIC_SFMC_CONVERSION_BASE
// misalnya: https://click.s4.exacttarget.com
const BASE_CONVERSION_URL =
    process.env.NEXT_PUBLIC_SFMC_CONVERSION_BASE || "https://click.exacttarget.com";

/**
 * Helper sederhana untuk baca cookie di browser
 */
function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()!.split(";").shift() || null;
    }
    return null;
}

export default function ConversionPageClient() {
    const [tracking, setTracking] = useState<TrackingParams | null>(null);
    const [hasCookie, setHasCookie] = useState<boolean | null>(null);

    useEffect(() => {
        const rawCookie = getCookie(TRACKING_COOKIE_NAME);
        if (!rawCookie) {
            setHasCookie(false);
            setTracking(null);
            return;
        }

        try {
            const decoded = decodeURIComponent(rawCookie);
            const parsed = JSON.parse(decoded) as TrackingParams;
            setTracking(parsed);
            setHasCookie(true);
        } catch (e) {
            console.error("Failed to parse tracking cookie", e);
            setHasCookie(false);
            setTracking(null);
        }
    }, []);

    /**
     * Build XML string sesuai spesifikasi SFMC Conversion Tracking.
     * Tanpa spasi antar tag.
     */
    const xmlString = useMemo(() => {
        if (!tracking) return null;

        const memberId = tracking.mid ?? "";
        const jobId = tracking.j ?? "";
        const subId = tracking.sfmc_sub ?? "";
        const listId = tracking.l ? `${tracking.l}_HTML` : "";
        const originalLinkId = tracking.u ?? "";
        const batchId = tracking.jb ?? "";

        // Di sini kita pakai:
        // - email kosong (docs: boleh empty)
        // - conversion_link_id = 1 (boleh kamu ubah per page)
        // - link_alias = "Conversion Page" (nama yang muncul di laporan)
        // - display_order = 1
        // - data_set kosong (tanpa transaksi); bisa kamu extend kalau mau kirim Amt/Unit
        const parts = [
            "<system>",
            "<system_name>tracking</system_name>",
            "<action>conversion</action>",
            `<member_id>${memberId}</member_id>`,
            `<job_id>${jobId}</job_id>`,
            "<email></email>",
            `<sub_id>${subId}</sub_id>`,
            `<list>${listId}</list>`,
            `<original_link_id>${originalLinkId}</original_link_id>`,
            `<BatchID>${batchId}</BatchID>`,
            "<conversion_link_id>1</conversion_link_id>",
            "<link_alias>Conversion Page</link_alias>",
            "<display_order>1</display_order>",
            "<data_set></data_set>",
            "</system>",
        ];

        return parts.join("");
    }, [tracking]);

    /**
     * Build src untuk <img>, encode XML sebagai query param "xml"
     */
    const imgSrc = useMemo(() => {
        if (!xmlString) return null;
        const base = BASE_CONVERSION_URL.replace(/\/$/, ""); // buang trailing slash
        const encodedXml = encodeURIComponent(xmlString);
        return `${base}/conversion.aspx?xml=${encodedXml}`;
    }, [xmlString]);

    const showTrackerImg = hasCookie === true && !!imgSrc;

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
                                Terima kasih, aksi Anda tercatat
                            </h1>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Halaman ini adalah conversions page untuk Salesforce Marketing
                                Cloud. Jika Anda datang dari email kampanye, aktivitas Anda di
                                halaman ini akan dicatat sebagai konversi.
                            </p>
                        </header>

                        {/* Status chip */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            <span
                                className={`inline-block h-2 w-2 rounded-full ${showTrackerImg ? "bg-emerald-400" : "bg-zinc-500"
                                    }`}
                            />
                            {hasCookie === null && "Memeriksa data tracking..."}
                            {hasCookie === false &&
                                "Tidak ditemukan data tracking dari landing page."}
                            {hasCookie === true &&
                                (showTrackerImg
                                    ? "Tracking aktif. Konversi sedang dilaporkan."
                                    : "Data tracking ditemukan, menyiapkan pelaporan...")}
                        </div>

                        {/* Optional: debug ringkas data tracking */}
                        <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-zinc-400 space-y-1">
                            <p className="font-medium text-zinc-200 mb-1">
                                Ringkasan Tracking (opsional):
                            </p>
                            {tracking ? (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <div>
                                        <span className="text-zinc-500">Job ID (job_id)</span>
                                        <p className="truncate text-zinc-200">
                                            {tracking.j || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Subscriber ID (sub_id)</span>
                                        <p className="truncate text-zinc-200">
                                            {tracking.sfmc_sub || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">List ID (list)</span>
                                        <p className="truncate text-zinc-200">
                                            {tracking.l ? `${tracking.l}_HTML` : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Original Link ID (u)</span>
                                        <p className="truncate text-zinc-200">
                                            {tracking.u || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Batch ID (BatchID)</span>
                                        <p className="truncate text-zinc-200">
                                            {tracking.jb || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">MID (member_id)</span>
                                        <p className="truncate text-zinc-200">
                                            {tracking.mid || "-"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-zinc-500">
                                    Tidak ada data tracking yang bisa ditampilkan.
                                </p>
                            )}
                        </div>

                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Kami hanya mengirimkan informasi teknis (job, list, member, link)
                            untuk keperluan reporting kampanye. Tidak ada data sensitif seperti
                            password yang dikirimkan.
                        </p>

                        {/* Tracking pixel (hanya kalau ada cookie & XML siap) */}
                        {showTrackerImg && (
                            <img
                                src={imgSrc!}
                                width={1}
                                height={1}
                                alt=""
                                className="opacity-0 pointer-events-none"
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
