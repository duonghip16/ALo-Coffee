import { db } from "./firebase-client"
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, onSnapshot, orderBy } from "firebase/firestore"
import type { POSOrder, POSOrderItem } from "./types/pos"
import { updateTableStatus } from "./table-service"

const ORDERS_COLLECTION = "orders"

export async function createPOSOrder(data: Omit<POSOrder, "id" | "code" | "createdAt" | "updatedAt">): Promise<string> {
  const now = Date.now()
  const code = `POS${now.toString().slice(-8)}`
  
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...data,
    code,
    createdAt: now,
    updatedAt: now
  })

  if (data.tableId && data.status !== "draft") {
    await updateTableStatus(data.tableId, "serving", docRef.id)
  }

  return docRef.id
}

export async function updatePOSOrder(id: string, data: Partial<POSOrder>): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Date.now()
  })

  if (data.status === "completed" || data.status === "cancelled") {
    const order = await getPOSOrder(id)
    if (order?.tableId) {
      await updateTableStatus(order.tableId, "available")
    }
  }
}

export async function getPOSOrder(id: string): Promise<POSOrder | null> {
  const docRef = doc(db, ORDERS_COLLECTION, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as POSOrder : null
}

export async function getPOSOrders(filters?: { tableId?: string; status?: string }): Promise<POSOrder[]> {
  let q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"))
  
  if (filters?.tableId) {
    q = query(q, where("tableId", "==", filters.tableId))
  }
  if (filters?.status) {
    q = query(q, where("status", "==", filters.status))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as POSOrder))
}

export function subscribeToPOSOrders(callback: (orders: POSOrder[]) => void, filters?: { status?: string }) {
  let q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"))
  
  if (filters?.status) {
    q = query(q, where("status", "==", filters.status))
  }

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as POSOrder))
    callback(orders)
  })
}

export async function addItemToPOSOrder(orderId: string, item: POSOrderItem): Promise<void> {
  const order = await getPOSOrder(orderId)
  if (!order) throw new Error("Order not found")

  const items = [...order.items, item]
  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0)
  const total = subtotal - order.discount

  await updatePOSOrder(orderId, { items, subtotal, total })
}

export async function removeItemFromPOSOrder(orderId: string, itemIndex: number): Promise<void> {
  const order = await getPOSOrder(orderId)
  if (!order) throw new Error("Order not found")

  const items = order.items.filter((_, i) => i !== itemIndex)
  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0)
  const total = subtotal - order.discount

  await updatePOSOrder(orderId, { items, subtotal, total })
}

export async function updateOrderPayment(orderId: string, method: "cash" | "vietqr" | "card"): Promise<void> {
  await updatePOSOrder(orderId, {
    status: "paid",
    payment: { method, status: "paid" }
  })
}

export async function deletePOSOrder(orderId: string): Promise<void> {
  const order = await getPOSOrder(orderId)
  if (order?.tableId) {
    await updateTableStatus(order.tableId, "available")
  }
  const docRef = doc(db, ORDERS_COLLECTION, orderId)
  await updateDoc(docRef, {
    status: "cancelled",
    updatedAt: Date.now()
  })
}

export async function updateOrderItems(orderId: string, items: POSOrderItem[]): Promise<void> {
  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0)
  await updatePOSOrder(orderId, {
    items,
    subtotal,
    total: subtotal
  })
}
