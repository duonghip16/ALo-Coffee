"use client"

import { Navbar } from "./navbar"
import { Footer } from "@/components/home/footer"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  )
}
