"use client"

import { useEffect, useState } from "react"
import { subscribeToOrder } from "@/lib/firestore-service"
import type { Order } from "@/lib/firestore-service"

export function useOrderDetail(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToOrder(
      orderId,
      (data) => {
        setOrder(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [orderId])

  return { order, loading, error }
}
