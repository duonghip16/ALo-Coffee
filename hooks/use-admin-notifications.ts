"use client"

import { useEffect, useState, useCallback } from "react"
import { subscribeToAllOrders } from "@/lib/firestore-service"

interface AdminNotificationSound {
  newOrder: () => void
  statusChange: () => void
  enable: () => void
  disable: () => void
  isEnabled: () => boolean
}

export function useAdminNotifications(): AdminNotificationSound {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastNotifiedOrders, setLastNotifiedOrders] = useState<Set<string>>(new Set())
  const [isInitialized, setIsInitialized] = useState(false)

  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      // Tăng volume từ 0.3 lên 0.5
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
      
      console.log('[Admin Notifications] Sound played:', frequency, 'Hz for', duration, 's')
    } catch (error) {
      console.error("[Admin Notifications] Error playing sound:", error)
    }
  }

  const newOrder = useCallback(() => {
    playSound(800, 0.2)
    setTimeout(() => playSound(600, 0.2), 250)
  }, [])

  const statusChange = useCallback(() => {
    playSound(700, 0.3)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((orders) => {
      // Lần đầu load: chỉ lưu orders hiện có, không phát âm thanh
      if (!isInitialized) {
        const existingOrderIds = new Set(orders.map(o => o.id))
        setLastNotifiedOrders(existingOrderIds)
        setIsInitialized(true)
        console.log('[Admin Notifications] Initialized with', existingOrderIds.size, 'existing orders')
        return
      }

      // Sau khi initialized: chỉ phát âm thanh cho đơn mới thực sự
      orders.forEach((order) => {
        if (order.status === "pending" && !lastNotifiedOrders.has(order.id)) {
          console.log('[Admin Notifications] New order detected:', order.id, 'soundEnabled:', soundEnabled)
          if (soundEnabled) {
            console.log('[Admin Notifications] Playing sound for new order')
            newOrder()
          }
          sendAdminNotification("Đơn hàng mới", `Có đơn hàng mới từ ${order.customerName || "Khách hàng"}`)          
          setLastNotifiedOrders((prev) => new Set([...prev, order.id]))
        }
      })
    })

    return unsubscribe
  }, [lastNotifiedOrders, soundEnabled, newOrder, isInitialized])

  return {
    newOrder,
    statusChange,
    enable: () => setSoundEnabled(true),
    disable: () => setSoundEnabled(false),
    isEnabled: () => soundEnabled,
  }
}

export function sendAdminNotification(title: string, message: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      badge: "/coffee-icon.png",
      tag: "admin-notification",
    })
  }
}
