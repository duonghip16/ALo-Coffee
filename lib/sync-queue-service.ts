import { initOfflineDB, markOrderSynced } from "./offline-service"
import { createPOSOrder } from "./pos-order-service"

interface QueueItem {
  id: string
  type: "order" | "invoice"
  data: any
  timestamp: number
  retries: number
}

const MAX_RETRIES = 3
const BATCH_SIZE = 5

export async function addToSyncQueue(type: "order" | "invoice", data: any) {
  const db = await initOfflineDB()
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await db.put("orders", {
    id,
    data: { type, ...data },
    synced: false,
    timestamp: Date.now()
  })
  
  return id
}

export async function processSyncQueue() {
  const db = await initOfflineDB()
  const unsynced = await db.getAll("orders")
  const pending = unsynced.filter(item => !item.synced).slice(0, BATCH_SIZE)
  
  if (pending.length === 0) return { success: 0, failed: 0 }
  
  let success = 0
  let failed = 0
  
  for (const item of pending) {
    try {
      if (item.data.type === "order") {
        await createPOSOrder(item.data)
      }
      await markOrderSynced(item.id)
      success++
    } catch (error) {
      failed++
      console.error(`Sync failed for ${item.id}:`, error)
    }
  }
  
  return { success, failed }
}

export function startAutoSync(intervalMs = 30000) {
  const interval = setInterval(async () => {
    if (navigator.onLine) {
      const result = await processSyncQueue()
      if (result.success > 0) {
        console.log(`Synced ${result.success} items`)
      }
    }
  }, intervalMs)
  
  return () => clearInterval(interval)
}
