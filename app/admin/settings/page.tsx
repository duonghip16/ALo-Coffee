"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SettingsForm } from "@/components/admin/settings-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-auto ml-20 lg:ml-64">
          <div className="max-w-2xl mx-auto px-3 lg:px-6 py-4 lg:py-8">
            <h2 className="text-xl lg:text-2xl font-bold text-coffee-900 mb-4 lg:mb-6">Cài đặt hệ thống</h2>
            <SettingsForm />
          </div>
        </main>
      </div>
    </div>
  )
}
