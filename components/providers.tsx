"use client"

import dynamic from "next/dynamic"
import { type ReactNode, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { registerServiceWorker } from "@/lib/pwa-service"

const AuthProvider = dynamic(
  () => import("@/context/auth-context").then((mod) => ({ default: mod.AuthProvider })),
  { ssr: false }
)

const InstallPrompt = dynamic(
  () => import("@/components/pwa/install-prompt").then((mod) => ({ default: mod.InstallPrompt })),
  { ssr: false }
)

const DarkModeToggle = dynamic(
  () => import("@/components/ui/dark-mode-toggle").then((mod) => ({ default: mod.DarkModeToggle })),
  { ssr: false }
)

const BackToTop = dynamic(
  () => import("@/components/ui/back-to-top").then((mod) => ({ default: mod.BackToTop })),
  { ssr: false }
)

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        <InstallPrompt />
        <BackToTop />
        <Toaster position="top-center" richColors />
        <div className="fixed bottom-4 right-4 z-50">
          <DarkModeToggle />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
