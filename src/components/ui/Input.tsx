'use client'
import { cn } from "@/lib/utils"
import React from "react"

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cn('input', props.className)} />
}