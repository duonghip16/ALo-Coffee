"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Star, MessageSquare, Coffee } from "lucide-react"
import type { Order } from "@/lib/firestore-service"

interface AnalyticsDashboardProps {
  orders: Order[]
}

const COLORS = {
  primary: "#8B4513",
  secondary: "#D2691E",
  accent: "#F4A460",
  success: "#228B22",
  warning: "#FF8C00",
  danger: "#DC143C"
}

export function AnalyticsDashboard({ orders }: AnalyticsDashboardProps) {
  // Revenue data for last 7 days
  const revenueData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    return last7Days.map(date => {
      const dayOrders = orders.filter(order => {
        if (!order.createdAt) return false
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
        return orderDate === date && order.payment?.status === "paid"
      })

      const revenue = dayOrders.reduce((sum, order) => sum + (order.amounts?.total || 0), 0)

      return {
        date: new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length
      }
    })
  }, [orders])

  // Top 10 best-selling products
  const topProducts = useMemo(() => {
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>()

    orders.forEach(order => {
      if (order.status === "completed" || order.status === "ready") {
        order.items?.forEach(item => {
          const existing = productSales.get(item.productId) || {
            name: item.name,
            quantity: 0,
            revenue: 0
          }
          existing.quantity += item.quantity || 0
          existing.revenue += (item.unitPrice || 0) * (item.quantity || 0)
          productSales.set(item.productId, existing)
        })
      }
    })

    return Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
  }, [orders])

  // Customer statistics
  const customerStats = useMemo(() => {
    const customers = new Map<string, { orders: number; totalSpent: number; lastOrder: Date }>()

    orders.forEach(order => {
      if (order.userId && order.createdAt) {
        const orderDate = new Date(order.createdAt)
        const existing = customers.get(order.userId) || {
          orders: 0,
          totalSpent: 0,
          lastOrder: orderDate
        }
        existing.orders += 1
        existing.totalSpent += order.amounts?.total || 0
        if (orderDate > existing.lastOrder) {
          existing.lastOrder = orderDate
        }
        customers.set(order.userId, existing)
      }
    })

    const customerArray = Array.from(customers.values())
    const newCustomers = customerArray.filter(c => c.orders === 1).length
    const returningCustomers = customerArray.filter(c => c.orders > 1).length
    const avgOrderValue = customerArray.length > 0
      ? customerArray.reduce((sum, c) => sum + c.totalSpent, 0) / customerArray.length
      : 0

    return {
      total: customers.size,
      new: newCustomers,
      returning: returningCustomers,
      avgOrderValue
    }
  }, [orders])

  // Order status distribution
  const statusData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status === "pending" ? "Chờ xác nhận" :
            status === "confirmed" ? "Đã xác nhận" :
            status === "preparing" ? "Đang chuẩn bị" :
            status === "ready" ? "Sẵn sàng" :
            status === "completed" ? "Hoàn thành" : status,
      value: count,
      color: status === "pending" ? COLORS.warning :
             status === "confirmed" ? COLORS.primary :
             status === "preparing" ? COLORS.secondary :
             status === "ready" ? COLORS.accent :
             status === "completed" ? COLORS.success : COLORS.danger
    }))
  }, [orders])

  return (
    <div className="space-y-8">
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-coffee-900">Doanh thu 7 ngày</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()}đ`, "Doanh thu"]}
                labelStyle={{ color: COLORS.primary }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-coffee-900">Số đơn hàng</h3>
            <Coffee className="h-5 w-5 text-coffee-700" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [value, "Đơn hàng"]}
                labelStyle={{ color: COLORS.primary }}
              />
              <Bar dataKey="orders" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Top Products and Customer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-coffee-900">Top 10 món bán chạy</h3>
            <Badge variant="secondary" className="bg-coffee-100 text-coffee-800">
              Hôm nay
            </Badge>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-linear-to-r from-coffee-50 to-orange-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-coffee-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-coffee-900">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.quantity} phần đã bán</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-coffee-700">{product.revenue.toLocaleString()}đ</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-coffee-900">Thống kê khách hàng</h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tổng khách hàng</span>
              <span className="font-semibold text-coffee-900">{customerStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Khách hàng mới</span>
              <span className="font-semibold text-green-600">{customerStats.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Khách quay lại</span>
              <span className="font-semibold text-blue-600">{customerStats.returning}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Giá trị TB/đơn</span>
                <span className="font-semibold text-coffee-700">{customerStats.avgOrderValue.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Order Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-coffee-900">Trạng thái đơn hàng</h3>
            <Badge variant="outline" className="border-coffee-300 text-coffee-700">
              Phân bố hiện tại
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-coffee-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
