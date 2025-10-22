'use client'
import { cn } from "../utils"
import React from "react"

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cn('input', props.className)} />
}