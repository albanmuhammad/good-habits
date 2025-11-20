"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type TrackingParams = {
    // SFMC default params (kalau suatu saat dipakai)
    j?: string | null;
    sfmc_sub?: string | null;
    l?: string | null;
    u?: string | null;
    jb?: string | null;
    mid?: string | null;

    // PARAM KHUSUS YANG KAMU PAKAI DI URL:
    // ?cid=...&jid=...&aid=...&ck=...
    cid?: string | null;
    jid?: string | null;
    aid?: string | null;
    ck?: string | null;
};

type StatusType = "idle" | "success" | "error" | "sending";

const COOKIE_NAME = "sfmc_conv_tracking";

function setTrackingCookie(params: TrackingParams) {
    try {
        const cookieValue = encodeURIComponent(JSON.stringify(params));
        // Cookie 7 hari
        document.cookie = `${COOKIE_NAME}=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 7
            }`;
    } catch (e) {
        console.error("Failed to write tracking cookie", e);
    }
}

function getTrackingCookie(): TrackingParams | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";").map((c) => c.trim());
    const pair = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!pair) return null;

    try {
        const raw = decodeURIComponent(pair.split("=")[1] || "");
        const parsed = JSON.parse(raw) as TrackingParams;
        return parsed;
    } catch (e) {
        console.error("Failed to parse tracking cookie", e);
        return null;
    }
}

function clearTrackingCookie() {
    // hapus cookie
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export default function TrackingLandingClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [trackingParams, setTrackingParams] = useState<TrackingParams>({});
    const [hasParams, setHasParams] = useState(false);
    const [status, setStatus] = useState<StatusType>("idle");
    const [statusMessage, setStatusMessage] = useState<string>("");

    useEffect(() => {
        // Ambil semua parameter yang kita pedulikan
        const params: TrackingParams = {
            // default SFMC (optional, kalau suatu saat mau dipakai)
            // j: searchParams.get("j"),
            // sfmc_sub: searchParams.get("sfmc_sub"),
            // l: searchParams.get("l"),
            // u: searchParams.get("u"),
            // jb: searchParams.get("jb"),
            // mid: searchParams.get("mid"),

            // PARAM KHUSUS URL KAMU
            cid: searchParams.get("cid"),
            jid: searchParams.get("jid"),
            aid: searchParams.get("aid"),
            ck: searchParams.get("ck"),
        };

        const hasAny = Object.values(params).some((v) => v && v.length > 0);

        setTrackingParams(params);
        setHasParams(hasAny);

        if (hasAny) {
            setTrackingCookie(params);
            console.log("[Tracking] Saved params to cookie", params);
        }
    }, [searchParams]);

    const handleSendConversionEvent = () => {
        setStatus("sending");
        setStatusMessage("");

        // 1) Baca cookie
        const cookieData = getTrackingCookie();

        if (!cookieData) {
            setStatus("error");
            setStatusMessage(
                "Tidak ditemukan data tracking di cookie. Buka halaman ini dari email terlebih dahulu."
            );
            return;
        }

        // Wajib: minimal harus punya sesuatu yang bisa dipakai
        const hasImportantValue =
            cookieData.cid || cookieData.jid || cookieData.aid || cookieData.ck;

        if (!hasImportantValue) {
            setStatus("error");
            setStatusMessage(
                "Cookie tracking ada, tetapi tidak berisi nilai penting (cid/jid/aid/ck)."
            );
            return;
        }

        // 2) Pastikan SalesforceInteractions siap
        if (
            typeof window === "undefined" ||
            !window.SalesforceInteractions?.sendEvent
        ) {
            console.warn("SalesforceInteractions belum siap");
            setStatus("error");
            setStatusMessage(
                "SalesforceInteractions belum siap. Coba refresh halaman dan klik lagi."
            );
            return;
        }

        try {
            // 3) Bangun payload event untuk Data Cloud
            const eventData = {
                eventType: "emailButtonConverted",
                interaction: {
                    name: "Email Button Converted",
                    eventType: "emailButtonConverted",
                    category: "Engagement",
                    // Map sesuai schema:
                    // emailId, jobId, actionId, userId
                    emailId: cookieData.cid ?? undefined,
                    jobId: cookieData.jid ?? undefined,
                    actionId: cookieData.aid ?? undefined,
                    userId: cookieData.ck ?? cookieData.sfmc_sub ?? undefined,
                },
                user: {
                    userId: cookieData.ck ?? cookieData.sfmc_sub ?? undefined,
                },
                source: {
                    pageType: "emailConversionPage",
                    url:
                        typeof window !== "undefined" ? window.location.href : undefined,
                    urlReferrer:
                        typeof document !== "undefined"
                            ? document.referrer || undefined
                            : undefined,
                    channel: "Web",
                },
            };

            console.log("📤 Sending Email Button Converted event:", eventData);
            window.SalesforceInteractions!.sendEvent(eventData);
            console.log("✅ Event sent via sendEvent()");

            // 4) Hapus cookie setelah KIRIM PERTAMA KALI
            clearTrackingCookie();

            setStatus("success");
            setStatusMessage("Konversi berhasil dikirim ke Data Cloud.");

            // (Opsional) Redirect setelah sukses
            // router.push("/some/thank-you-page");
        } catch (error) {
            console.error("❌ Error sending conversion event:", error);
            setStatus("error");
            setStatusMessage("Gagal mengirim event konversi. Cek console log.");
        }
    };

    const isSubmitting = status === "sending";

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
                                Konfirmasi Konversi Email
                            </h1>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Halaman ini digunakan untuk melacak konversi dari email
                                kampanye Salesforce Marketing Cloud. Ketika Anda menekan tombol
                                di bawah, informasi tracking akan dikirim ke Data Cloud.
                            </p>
                        </header>

                        {/* Info chip */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            {hasParams
                                ? "Parameter tracking ditemukan dan disimpan ke cookie."
                                : "Tidak ada parameter tracking yang terdeteksi di URL."}
                        </div>

                        {/* Ringkasan parameter (opsional) */}
                        <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-zinc-400 space-y-1">
                            <p className="font-medium text-zinc-200 mb-1">
                                Detail Tracking (opsional):
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>
                                    <span className="text-zinc-500">Campaign / Email ID (cid)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.cid || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">Job ID (jid)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.jid || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">Action ID (aid)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.aid || "-"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-zinc-500">Contact Key (ck)</span>
                                    <p className="truncate text-zinc-200">
                                        {trackingParams.ck || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status message */}
                        {status !== "idle" && statusMessage && (
                            <p
                                className={`text-xs ${status === "success" ? "text-emerald-400" : "text-amber-400"
                                    }`}
                            >
                                {statusMessage}
                            </p>
                        )}

                        {/* Button kirim event */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleSendConversionEvent}
                                disabled={isSubmitting}
                                className="w-full inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white text-black px-5 py-3 text-sm font-medium tracking-wide shadow-lg shadow-white/10 transition hover:bg-zinc-100 hover:shadow-xl hover:-translate-y-[1px] disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {isSubmitting
                                    ? "Mengirim event..."
                                    : "Kirim Event Konversi ke Data Cloud"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
