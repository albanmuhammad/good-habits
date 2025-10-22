'use client'

export default function RewardTree({ level = 0 }: { level?: number }) {
    const leaves = Math.min(60, Math.max(0, level))

    return (
        <svg viewBox="0 0 200 200" className="w-full h-48">
            <rect x="95" y="120" width="10" height="60" rx="5" className="fill-neutral-700"></rect>
            {Array.from({ length: leaves }).map((_, i) => (
                <circle key={i} cx={100 + Math.sin(i) * 50} cy={120 - (i % 10) * 8} r={4} className="fill-accent"></circle>
            ))}
        </svg>
    )
}