"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useOrders } from "@/hooks/use-orders"
import { OrderCard } from "@/components/tracking/order-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Package, Clock, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function OrderTrackingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { orders, loading } = useOrders(user?.id || null)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

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

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true
    if (filter === "pending") return ["pending", "confirmed", "preparing", "ready"].includes(order.status)
    if (filter === "completed") return order.status === "completed"
    return true
  })

  const stats = {
    all: orders.length,
    pending: orders.filter(o => ["pending", "confirmed", "preparing", "ready"].includes(o.status)).length,
    completed: orders.filter(o => o.status === "completed").length
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#1A0F08]">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-linear-to-br from-[#6B4423] to-[#8E5522] dark:from-[#3A2416] dark:to-[#2A1A12] sticky top-0 z-30 shadow-lg"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.button 
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white dark:text-[#FEF7ED] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Lịch sử đơn hàng
              </h1>
              <p className="text-white/90 dark:text-[#E8DCC8] text-sm mt-1">Theo dõi tất cả đơn hàng của bạn</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { key: "all", label: "Tất cả", icon: Package, count: stats.all },
              { key: "pending", label: "Đang xử lý", icon: Clock, count: stats.pending },
              { key: "completed", label: "Hoàn thành", icon: CheckCircle2, count: stats.completed }
            ].map(({ key, label, icon: Icon, count }) => (
              <motion.button
                key={key}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  filter === key
                    ? "bg-white dark:bg-[#FEF7ED] text-[#6B4423] dark:text-[#3A2416] shadow-lg"
                    : "bg-white/10 dark:bg-white/5 text-white dark:text-[#FEF7ED] hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === key 
                    ? "bg-[#6B4423] dark:bg-[#3A2416] text-white dark:text-[#FEF7ED]" 
                    : "bg-white/20 dark:bg-white/10 text-white dark:text-[#E8DCC8]"
                }`}>
                  {count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white dark:bg-[#3A2416] rounded-2xl p-12 shadow-lg border border-[#E8DCC8] dark:border-[#5A3A1F]">
              <div className="w-20 h-20 bg-[#FEF7ED] dark:bg-[#5A3A1F] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-[#6B4423] dark:text-[#C47B3E]" />
              </div>
              <h3 className="text-xl font-bold text-[#2A1A12] dark:text-[#FEF7ED] mb-2">
                {filter === "all" ? "Chưa có đơn hàng" : filter === "pending" ? "Không có đơn đang xử lý" : "Chưa có đơn hoàn thành"}
              </h3>
              <p className="text-[#6B4423]/70 dark:text-[#E8DCC8]/80 mb-6">
                {filter === "all" ? "Hãy đặt món yêu thích của bạn ngay!" : "Thử chọn bộ lọc khác"}
              </p>
              {filter === "all" && (
                <Button 
                  onClick={() => router.push("/menu")} 
                  className="bg-linear-to-r from-[#6B4423] to-[#8E5522] hover:from-[#8E5522] hover:to-[#6B4423] dark:from-[#C47B3E] dark:to-[#8E5522] dark:hover:from-[#8E5522] dark:hover:to-[#6B4423] text-white shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Đặt hàng ngay
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
