import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { getVietnamTime, isToday } from "@/lib/date-utils"
import type { Order } from "@/lib/firestore-service"

export interface AnalyticsData {
  revenue: number
  orders: number
  items: number
  avgOrderValue: number
  customers: {
    total: number
    new: number
    returning: number
    returnRate: number
  }
  topProducts: Array<{
    id: string
    name: string
    quantity: number
    revenue: number
    imageUrl?: string
  }>
  chartData: Array<{
    date: string
    revenue: number
    orders: number
    items: number
  }>
}

export async function getAnalytics(startDate: Date, endDate: Date): Promise<AnalyticsData> {
  const ordersRef = collection(db, "orders")
  const snapshot = await getDocs(ordersRef)
  
  const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]
  
  const filteredOrders = allOrders.filter(order => {
    if (!order.createdAt) return false
    const orderDate = new Date(order.createdAt)
    return orderDate >= startDate && orderDate <= endDate
  })

  const paidOrders = filteredOrders.filter(o => o.payment?.status === "paid")
  
  const revenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const orders = paidOrders.length
  const items = paidOrders.reduce((sum, o) => sum + (Array.isArray(o.items) ? o.items.length : 0), 0)
  const avgOrderValue = orders > 0 ? revenue / orders : 0

  const usersRef = collection(db, "users")
  const usersSnapshot = await getDocs(usersRef)
  const allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  const customers = allUsers.filter(u => !u.isArchived)
  const newCustomers = customers.filter(u => {
    if (!u.createdAt) return false
    const userDate = new Date(u.createdAt)
    return userDate >= startDate && userDate <= endDate
  })

  const customerIds = new Set(paidOrders.map(o => o.userId))
  const returningCustomers = Array.from(customerIds).filter(userId => {
    const userOrders = paidOrders.filter(o => o.userId === userId)
    return userOrders.length >= 2
  })

  const productMap = new Map<string, { name: string; quantity: number; revenue: number; imageUrl?: string }>()
  
  paidOrders.forEach(order => {
    const items = Array.isArray(order.items) ? order.items : []
    items.forEach(item => {
      const existing = productMap.get(item.productId || item.name)
      if (existing) {
        existing.quantity += item.qty || item.quantity || 0
        existing.revenue += (item.unitPrice || 0) * (item.qty || item.quantity || 0)
      } else {
        productMap.set(item.productId || item.name, {
          name: item.name,
          quantity: item.qty || item.quantity || 0,
          revenue: (item.unitPrice || 0) * (item.qty || item.quantity || 0),
          imageUrl: undefined
        })
      }
    })
  })

  const topProducts = Array.from(productMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)

  const dateMap = new Map<string, { revenue: number; orders: number; items: number }>()
  
  paidOrders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    const existing = dateMap.get(date)
    const itemCount = Array.isArray(order.items) ? order.items.length : 0
    if (existing) {
      existing.revenue += order.total || 0
      existing.orders += 1
      existing.items += itemCount
    } else {
      dateMap.set(date, {
        revenue: order.total || 0,
        orders: 1,
        items: itemCount
      })
    }
  })

  const chartData = Array.from(dateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return {
    revenue,
    orders,
    items,
    avgOrderValue,
    customers: {
      total: customers.length,
      new: newCustomers.length,
      returning: returningCustomers.length,
      returnRate: customerIds.size > 0 ? (returningCustomers.length / customerIds.size) * 100 : 0
    },
    topProducts,
    chartData
  }
}
