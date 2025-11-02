import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

import { Amatic_SC as V0_Font_Amatic_SC, Geist_Mono as V0_Font_Geist_Mono, Abril_Fatface as V0_Font_Abril_Fatface } from 'next/font/google'

// Initialize fonts
const _amaticSc = V0_Font_Amatic_SC({ subsets: ['latin'], weight: ["400","700"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _abrilFatface = V0_Font_Abril_Fatface({ subsets: ['latin'], weight: ["400"] })

export const metadata: Metadata = {
  title: "Remote Timezone",
  description: "Compare timezones across the world with an interactive dial interface",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
