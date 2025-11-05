"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAdminOrders } from "@/hooks/use-admin-orders"
import { useAdminNotifications } from "@/hooks/use-admin-notifications"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { OrderListAdmin } from "@/components/admin/order-list-admin"
import { DashboardCard } from "@/components/admin/dashboard-card"
import type { Order } from "@/lib/firestore-service"
import { motion } from "framer-motion"
import { Package, Clock, ChefHat, DollarSign } from "lucide-react"
import { isToday } from "@/lib/date-utils"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { orders, loading } = useAdminOrders()
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useAdminNotifications()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải đơn hàng...</p>
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
              className="mb-6 lg:mb-8"
            >
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#2A1A12] dark:text-[#4e3521] mb-2 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Quản lý đơn hàng</h2>
              <p className="text-sm font-semibold text-[#2A1A12] dark:text-[#4e3521]">Theo dõi và cập nhật trạng thái đơn hàng</p>
            </motion.div>

            <div className="space-y-4 lg:space-y-6">
                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-6 mb-4 lg:mb-8"
                >
                  <DashboardCard
                    title="Tổng đơn hôm nay"
                    value={orders.filter(o => o.createdAt && isToday(o.createdAt)).length}
                    icon={Package}
                    subtitle="+12% vs hôm qua"
                    index={0}
                  />
                  <DashboardCard
                    title="Đơn chờ xử lý"
                    value={orders.filter(o => o.status === "pending").length}
                    icon={Clock}
                    subtitle="Cần xác nhận"
                    index={1}
                  />
                  <DashboardCard
                    title="Đang chuẩn bị"
                    value={orders.filter(o => o.status === "preparing").length}
                    icon={ChefHat}
                    subtitle="Trong bếp"
                    index={2}
                  />
                  <DashboardCard
                    title="Doanh thu hôm nay"
                    value={`${orders
                      .filter(o => o.createdAt && isToday(o.createdAt) && o.payment?.status === "paid")
                      .reduce((sum, o) => sum + (o.total || 0), 0)
                      .toLocaleString()}đ`}
                    icon={DollarSign}
                    subtitle="+8% vs hôm qua"
                    index={3}
                  />
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-1.5 lg:gap-2 mb-3 lg:mb-6 overflow-x-auto pb-2 scrollbar-hide"
                >
                  {(["all", "pending", "confirmed", "preparing", "ready", "completed"] as const).map((status, index) => (
                    <motion.button
                      key={status}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => setFilterStatus(status)}
                      className={`px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[10px] lg:text-sm font-bold transition-all whitespace-nowrap ${
                        filterStatus === status
                          ? "bg-[#3A2416] text-white shadow-md"
                          : "bg-muted dark:bg-[#906b4c] text-[#2A1A12] dark:text-[#FFF9F0] hover:bg-coffee-700 dark:hover:bg-[#47362A] hover:shadow-sm"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    </motion.button>
                  ))}
                </motion.div>

                {/* Orders List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <OrderListAdmin orders={filteredOrders} />
                </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
