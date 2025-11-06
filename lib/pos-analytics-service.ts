import { db } from "./firebase-client"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import type { Invoice } from "./types/pos"

export interface DailyStats {
  date: string
  revenue: number
  orderCount: number
  avgOrderValue: number
}

export interface ProductStats {
  productId: string
  name: string
  quantity: number
  revenue: number
}

export async function getDailyRevenue(startDate: number, endDate: number): Promise<DailyStats[]> {
  const q = query(
    collection(db, "invoices"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    where("status", "in", ["paid", "printed", "archived"])
  )

  const snapshot = await getDocs(q)
  const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice))

  const dailyMap = new Map<string, { revenue: number; count: number }>()

  invoices.forEach(invoice => {
    const date = new Date(invoice.createdAt).toISOString().split("T")[0]
    const current = dailyMap.get(date) || { revenue: 0, count: 0 }
    dailyMap.set(date, {
      revenue: current.revenue + invoice.total,
      count: current.count + 1
    })
  })

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orderCount: data.count,
    avgOrderValue: Math.round(data.revenue / data.count)
  })).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getTopProducts(startDate: number, endDate: number, limit = 10): Promise<ProductStats[]> {
  const q = query(
    collection(db, "pos_orders"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    where("status", "==", "paid")
  )

  const snapshot = await getDocs(q)
  const productMap = new Map<string, ProductStats>()

  snapshot.docs.forEach(doc => {
    const order = doc.data()
    order.items?.forEach((item: any) => {
      const current = productMap.get(item.productId) || {
        productId: item.productId,
        name: item.name,
        quantity: 0,
        revenue: 0
      }
      productMap.set(item.productId, {
        ...current,
        quantity: current.quantity + item.qty,
        revenue: current.revenue + (item.unitPrice * item.qty)
      })
    })
  })

  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export async function getTotalStats(startDate: number, endDate: number) {
  const q = query(
    collection(db, "invoices"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    where("status", "in", ["paid", "printed", "archived"])
  )

  const snapshot = await getDocs(q)
  const invoices = snapshot.docs.map(doc => doc.data() as Invoice)

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalOrders = invoices.length
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  return { totalRevenue, totalOrders, avgOrderValue }
}
