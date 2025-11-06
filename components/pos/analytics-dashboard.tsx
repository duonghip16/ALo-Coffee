"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDailyRevenue, getTopProducts, getTotalStats } from "@/lib/pos-analytics-service"
import { exportAnalyticsPDF, exportAnalyticsCSV } from "@/lib/export-service"
import type { DailyStats, ProductStats } from "@/lib/pos-analytics-service"
import { DollarSign, ShoppingCart, TrendingUp, Package, Download, FileText } from "lucide-react"

export function AnalyticsDashboard() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [topProducts, setTopProducts] = useState<ProductStats[]>([])
  const [totalStats, setTotalStats] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 })
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime() + 86400000

      const [daily, products, stats] = await Promise.all([
        getDailyRevenue(start, end),
        getTopProducts(start, end),
        getTotalStats(start, end)
      ])

      setDailyStats(daily)
      setTopProducts(products)
      setTotalStats(stats)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button onClick={loadData} disabled={loading}>
          {loading ? "Đang tải..." : "Cập nhật"}
        </Button>
        <Button variant="outline" onClick={() => exportAnalyticsPDF(dailyStats, topProducts, totalStats.totalRevenue, totalStats.totalOrders, startDate, endDate)}>
          <FileText className="w-4 h-4 mr-2" />
          PDF
        </Button>
        <Button variant="outline" onClick={() => exportAnalyticsCSV(dailyStats, topProducts)}>
          <Download className="w-4 h-4 mr-2" />
          CSV
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">{totalStats.totalRevenue.toLocaleString()}đ</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-blue-600">{totalStats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giá trị TB</p>
              <p className="text-2xl font-bold text-purple-600">{totalStats.avgOrderValue.toLocaleString()}đ</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Doanh thu theo ngày
          </h3>
          <div className="space-y-2">
            {dailyStats.map(stat => (
              <div key={stat.date} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">{new Date(stat.date).toLocaleDateString("vi-VN")}</p>
                  <p className="text-xs text-muted-foreground">{stat.orderCount} đơn</p>
                </div>
                <p className="font-bold text-green-600">{stat.revenue.toLocaleString()}đ</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top sản phẩm bán chạy
          </h3>
          <div className="space-y-2">
            {topProducts.map((product, index) => (
              <div key={product.productId} className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SL: {product.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">{product.revenue.toLocaleString()}đ</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
