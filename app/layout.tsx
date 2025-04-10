import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import SavedGiftsWrapper from "@/components/saved-gifts-wrapper"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GiftSage - Intelligent Gift Recommendations",
  description: "AI-powered text-based gift recommendations for any occasion",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers session={session}>
          {children}
          <SavedGiftsWrapper />
        </Providers>
      </body>
    </html>
  )
}


import './globals.css'