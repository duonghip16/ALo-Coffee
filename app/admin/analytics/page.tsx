"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { motion } from "framer-motion"
import { getAnalytics, type AnalyticsData } from "@/lib/analytics-service"
import { AnalyticsKPI } from "@/components/admin/analytics-kpi"
import { AnalyticsChart } from "@/components/admin/analytics-chart"
import { AnalyticsCustomers } from "@/components/admin/analytics-customers"
import { AnalyticsTopProducts } from "@/components/admin/analytics-top-products"
import { AnalyticsDateFilter } from "@/components/admin/analytics-date-filter"
import { getVietnamTime } from "@/lib/date-utils"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const end = getVietnamTime()
    const start = new Date(end)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        const data = await getAnalytics(dateRange.start, dateRange.end)
        setAnalytics(data)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [dateRange])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thống kê...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF6F0] dark:bg-[#EDE3D4]">
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-auto ml-20 lg:ml-64">
          <div className="max-w-7xl mx-auto px-3 lg:px-6 py-4 lg:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 lg:mb-6"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg lg:text-3xl font-extrabold text-[#2A1A12] dark:text-[#4e3521] mb-1 lg:mb-2 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Thống kê</h2>
                  <p className="text-xs lg:text-sm font-semibold text-[#2A1A12] dark:text-[#4e3521]">Phân tích doanh thu và hiệu suất kinh doanh</p>
                </div>
                <AnalyticsDateFilter dateRange={dateRange} onChange={setDateRange} />
              </div>
            </motion.div>

            {analytics && (
              <div className="space-y-3 lg:space-y-6">
                <AnalyticsKPI data={analytics} />
                <AnalyticsChart data={analytics.chartData} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnalyticsCustomers data={analytics.customers} />
                  <AnalyticsTopProducts products={analytics.topProducts} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
