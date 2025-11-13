import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Geist as V0_Font_Geist, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts - only load weights actually used to reduce memory
const _geist = V0_Font_Geist({
  subsets: ['latin'],
  weight: ["400","500","600"],
  display: 'swap',
  preload: true
})
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ['latin'],
  weight: ["400","600"],
  display: 'swap',
  preload: true
})

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
