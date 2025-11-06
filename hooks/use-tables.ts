import { useState, useEffect } from "react"
import { subscribeToTables } from "@/lib/table-service"
import type { Table } from "@/lib/types/pos"

export function useTables() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToTables((data) => {
      setTables(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { tables, loading }
}
