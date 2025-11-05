"use client"

import { useEffect, useState } from "react"
import { subscribeToUserOrders } from "@/lib/firestore-service"
import type { Order } from "@/lib/firestore-service"

export function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToUserOrders(
      userId,
      (data) => {
        setOrders(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [userId])

  return { orders, loading, error }
}
