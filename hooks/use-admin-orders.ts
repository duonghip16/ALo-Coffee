"use client"

import { useEffect, useState } from "react"
import { subscribeToAllOrders } from "@/lib/firestore-service"
import type { Order } from "@/lib/firestore-service"

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToAllOrders(
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
  }, [])

  return { orders, loading, error }
}
