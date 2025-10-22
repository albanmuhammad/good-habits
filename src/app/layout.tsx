import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Minimal monochrome habit tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='id'>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}