"use client"

import { useEffect, useState } from "react"
import { subscribeToUserOrders } from "@/lib/firestore-service"
import { sendBrowserNotification, ORDER_STATUS_MESSAGES } from "@/lib/notification-service"
import { useAuth } from "@/context/auth-context"

interface NotificationState {
  orderId: string
  status: string
}

export function useOrderNotifications() {
  const { user } = useAuth()
  const [lastNotified, setLastNotified] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    const unsubscribe = subscribeToUserOrders(user.uid, (orders) => {
      orders.forEach((order) => {
        // Only notify if status has changed
        if (lastNotified[order.id] !== order.status) {
          const statusInfo = ORDER_STATUS_MESSAGES[order.status as keyof typeof ORDER_STATUS_MESSAGES]
          if (statusInfo) {
            sendBrowserNotification(statusInfo.title, {
              body: statusInfo.message,
              badge: "/coffee-icon.png",
            })
          }
          setLastNotified((prev) => ({
            ...prev,
            [order.id]: order.status,
          }))
        }
      })
    })

    return unsubscribe
  }, [user, lastNotified])
}
