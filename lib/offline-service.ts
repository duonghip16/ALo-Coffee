import { openDB, DBSchema, IDBPDatabase } from "idb"

interface POSDB extends DBSchema {
  orders: {
    key: string
    value: {
      id: string
      data: any
      synced: boolean
      timestamp: number
    }
  }
  tables: {
    key: string
    value: any
  }
}

let db: IDBPDatabase<POSDB> | null = null

export async function initOfflineDB() {
  if (db) return db
  
  db = await openDB<POSDB>("pos-cache", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("tables")) {
        db.createObjectStore("tables", { keyPath: "id" })
      }
    }
  })
  
  return db
}

export async function cacheOrder(id: string, data: any) {
  const database = await initOfflineDB()
  await database.put("orders", {
    id,
    data,
    synced: false,
    timestamp: Date.now()
  })
}

export async function getUnsyncedOrders() {
  const database = await initOfflineDB()
  const all = await database.getAll("orders")
  return all.filter(order => !order.synced)
}

export async function markOrderSynced(id: string) {
  const database = await initOfflineDB()
  const order = await database.get("orders", id)
  if (order) {
    order.synced = true
    await database.put("orders", order)
  }
}

export async function cacheTables(tables: any[]) {
  const database = await initOfflineDB()
  const tx = database.transaction("tables", "readwrite")
  await Promise.all(tables.map(table => tx.store.put(table)))
  await tx.done
}

export async function getCachedTables() {
  const database = await initOfflineDB()
  return await database.getAll("tables")
}

export function isOnline() {
  return navigator.onLine
}

export function onOnlineStatusChange(callback: (online: boolean) => void) {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener("online", handleOnline)
  window.addEventListener("offline", handleOffline)
  
  return () => {
    window.removeEventListener("online", handleOnline)
    window.removeEventListener("offline", handleOffline)
  }
}
