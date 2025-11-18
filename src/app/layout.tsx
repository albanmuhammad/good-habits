// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Providers } from "./providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Habit Tracker - Bangun Kebiasaan yang Bertahan",
  description: "Lacak, tingkatkan, dan capai target harianmu dengan cara yang sederhana dan menyenangkan",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <Script id="sf-init" strategy="afterInteractive">
          {`
            (function initSF() {
              function start() {
                const SI = window.SalesforceInteractions;
                if (!SI?.init) return;

                // ✅ BENAR: gunakan 'consents' dan object { provider, purpose, status }
                SI.init({
                  consents: new Promise((resolve) => {
                    const { ConsentPurpose, ConsentStatus } = SI;
                    resolve([
                      {
                        provider: "Habit Tracker",
                        purpose: ConsentPurpose.Tracking,
                        status: ConsentStatus.OptIn
                      }
                    ]);
                  }),
                  logging: { level: 4 }
                }).then(() => {
                  try {
                    const cs = SI.getConsents?.();
                    console.log("[SF] current consents (after init):", cs);
                  } catch {}
                });
              }

              if (window.SalesforceInteractions?.init) {
                start();
              } else {
                const i = setInterval(() => {
                  if (window.SalesforceInteractions?.init) {
                    clearInterval(i);
                    start();
                  }
                }, 200);
              }
            })();
          `}
        </Script>
        {/* Load Beacon Script */}
        <Script
          src="https://cdn.c360a.salesforce.com/beacon/c360a/3a24c569-4981-4d56-ae14-953bb23885be/scripts/c360a.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>


      </body>
    </html>
  )
}