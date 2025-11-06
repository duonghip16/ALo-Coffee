import { useState, useEffect } from "react"
import { subscribeToPOSOrders } from "@/lib/pos-order-service"
import type { POSOrder } from "@/lib/types/pos"

export function usePOSOrders(filters?: { status?: string }) {
  const [orders, setOrders] = useState<POSOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToPOSOrders((data) => {
      setOrders(data)
      setLoading(false)
    }, filters)
    return () => unsubscribe()
  }, [filters?.status])

  return { orders, loading }
}
