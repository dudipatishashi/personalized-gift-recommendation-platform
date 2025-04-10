"use client"

import type { ReactNode } from "react"
import { SurveyProvider } from "@/context/survey-context"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export function Providers({
  children,
  session,
}: {
  children: ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SurveyProvider>{children}</SurveyProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
