'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function HabitChart({ data }: { data: { date: string, value: number }[] }) {
    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }}></XAxis>
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false}></YAxis>
                    <Tooltip />
                    <Area type="monotone" dataKey="value" fill="#16a34a22" stroke="#16a41a" strokeWidth={2}></Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}