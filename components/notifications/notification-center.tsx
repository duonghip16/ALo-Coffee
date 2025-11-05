"use client"

import { useAuth } from "@/context/auth-context"
import { subscribeToUserOrders } from "@/lib/firestore-service"
import { useEffect, useState } from "react"
import { Bell, X, Package, Clock, CheckCircle, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_MESSAGES } from "@/lib/notification-service"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface OrderNotification {
  orderId: string
  status: string
  total: number | undefined
  createdAt: number
}

export function NotificationCenter() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserOrders(user.uid, (orders) => {
      const recent = orders.slice(0, 5).map((order) => ({
        orderId: order.id,
        status: order.status,
        total: order.amounts?.total || order.total,
        createdAt: order.createdAt,
      }))
      setNotifications(recent)
    })

    return unsubscribe
  }, [user])

  const unreadCount = notifications.length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'preparing': return <ChefHat className="h-4 w-4 text-purple-600" />
      case 'ready': return <Package className="h-4 w-4 text-green-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-600" />
      default: return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg border z-50"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Thông báo
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Không có thông báo
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notif, index) => {
                    const statusMsg = ORDER_STATUS_MESSAGES[notif.status as keyof typeof ORDER_STATUS_MESSAGES]
                    return (
                      <motion.button
                        key={notif.orderId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          router.push(`/order-tracking/${notif.orderId}`)
                          setIsOpen(false)
                        }}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(notif.status)}
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">{statusMsg?.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{statusMsg?.message}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-gray-400">
                                  {new Date(notif.createdAt).toLocaleString("vi-VN")}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  #{notif.orderId.slice(0, 6)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-coffee-700 ml-2">
                            {notif.total?.toLocaleString()}đ
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
