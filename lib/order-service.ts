"use client"

import { db } from "@/lib/firebase-client"
import { collection, addDoc, doc, onSnapshot, query, where, orderBy, updateDoc, Timestamp, getDoc } from "firebase/firestore"
import { addLoyaltyPoints } from "@/lib/loyalty-service"

export interface OrderItem {
  productId: string
  name: string
  qty: number
  unitPrice: number
  toppings: Array<{ name: string; priceDiff: number }>
  note?: string
  status: string
}

export interface Order {
  id?: string
  userId: string
  code: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  payment: {
    method: "cash" | "vietqr"
    status: "pending" | "paid"
  }
  status: "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled"
  table?: string
  refCode?: string
  createdAt: number
  updatedAt: number
  note?: string
}

export async function createOrder(orderData: Omit<Order, "id" | "code" | "createdAt" | "updatedAt">): Promise<string> {
  const code = `ALO${Math.floor(100000 + Math.random() * 900000)}`
  
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    code,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  
  return docRef.id
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orderDoc = doc(db, "orders", orderId)
  const snap = await getDoc(orderDoc)
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null
}

export function subscribeToOrder(orderId: string, callback: (order: Order | null) => void) {
  const orderDoc = doc(db, "orders", orderId)
  
  return onSnapshot(orderDoc, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as Order)
    } else {
      callback(null)
    }
  })
}

export function subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order))
    callback(orders)
  })
}

export function subscribeToIncompleteOrders(callback: (orders: Order[]) => void) {
  const q = query(
    collection(db, "orders"),
    where("status", "in", ["pending", "paid", "preparing", "ready"]),
    orderBy("createdAt", "desc")
  )
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order))
    callback(orders)
  })
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const orderDoc = doc(db, "orders", orderId)
  await updateDoc(orderDoc, {
    status,
    updatedAt: Timestamp.now(),
  })
  
  if (status === "completed") {
    const order = await getOrderById(orderId)
    if (order && order.payment.status === "paid") {
      await addLoyaltyPoints(order.userId, order.total)
    }
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: "pending" | "paid") {
  const orderDoc = doc(db, "orders", orderId)
  await updateDoc(orderDoc, {
    "payment.status": paymentStatus,
    updatedAt: Timestamp.now(),
  })
}
