"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getOrderStats } from "@/lib/firestore-service"
import { useAdminOrders } from "@/hooks/use-admin-orders"
import { useAdminNotifications } from "@/hooks/use-admin-notifications"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardCard } from "@/components/admin/dashboard-card"
import { OrderListAdmin } from "@/components/admin/order-list-admin"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Order } from "@/lib/firestore-service"
import { BarChart3, Clock, ChefHat, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { isToday } from "@/lib/date-utils"

interface Stats {
  total: number
  today: number
  pending: number
  paid: number
  preparing: number
  ready: number
  completed: number
  cancelled: number
  totalRevenue: number
  todayRevenue: number
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { orders, loading: ordersLoading } = useAdminOrders()
  const [stats, setStats] = useState<Stats | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "preparing" | "ready" | "completed">("all")

  useAdminNotifications()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getOrderStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
      }
    }
    loadStats()
  }, [orders])

  if (authLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus)

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
              transition={{ duration: 0.4 }}
            >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-6 mb-4 lg:mb-8">
              <DashboardCard 
                title="Tổng đơn hàng" 
                value={stats?.total || 0} 
                icon={BarChart3}
                index={0}
              />
              <DashboardCard 
                title="Chờ xác nhận" 
                value={stats?.pending || 0} 
                icon={Clock}
                subtitle="Đơn mới"
                index={1}
              />
              <DashboardCard 
                title="Đang chuẩn bị" 
                value={stats?.preparing || 0} 
                icon={ChefHat}
                subtitle="Trong bếp"
                index={2}
              />
              <DashboardCard
                title="Doanh thu"
                value={`${(stats?.totalRevenue || 0).toLocaleString()}đ`}
                icon={DollarSign}
                subtitle="Hôm nay"
                index={3}
              />
            </div>

            {/* Orders Section */}
            <div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-3 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-extrabold text-[#2A1A12] dark:text-[#4e3521] tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Đơn hàng gần đây</h2>
                <div className="inline-flex gap-0.5 lg:gap-1 bg-[#6B4423] dark:bg-[#B26A36] rounded-xl lg:rounded-2xl p-0.5 lg:p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.06)] border border-[#D7C7B3] overflow-x-auto w-full lg:w-auto scrollbar-hide">
                  {(["all", "pending", "confirmed", "preparing", "ready", "completed"] as const).map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`relative px-2 lg:px-5 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl text-[10px] lg:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                        filterStatus === status
                          ? "bg-linear-to-r from-[#6B4423] to-[#4e3521] text-white shadow-md"
                          : "text-[#ffffff] dark:text-[#FFF9F0] hover:text-[#B26A36] hover:bg-[#FAF6F0] dark:hover:bg-[#3A2416]"
                      }`}
                    >
                      <span className="relative z-10">
                        {status === "all"
                          ? "Tất cả"
                          : status === "pending"
                            ? "Chờ xác nhận"
                            : status === "confirmed"
                              ? "Đã xác nhận"
                              : status === "preparing"
                                ? "Đang chuẩn bị"
                                : status === "ready"
                                  ? "Sẵn sàng"
                                  : "Hoàn thành"}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <OrderListAdmin orders={filteredOrders} />
            </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
