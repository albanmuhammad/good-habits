'use client'
import { cn } from '../utils'
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' }
export default function Button({ className, variant = 'default', ...props }: Props) {
    return (
        <button className={cn('btn', variant === 'primary' && 'btn-primary', className)} {...props}></button>
    )
}