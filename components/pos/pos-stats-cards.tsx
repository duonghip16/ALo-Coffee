"use client"

import { Card } from "@/components/ui/card"
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { useTables } from "@/hooks/use-tables"
import { usePOSOrders } from "@/hooks/use-pos-orders"

export function POSStatsCards() {
  const { tables } = useTables()
  const { orders } = usePOSOrders({ status: "pending" })

  const availableTables = tables.filter(t => t.status === "available").length
  const servingTables = tables.filter(t => t.status === "serving").length
  const pendingOrders = orders.length
  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bàn trống</p>
            <p className="text-xl font-bold">{availableTables}/{tables.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Đang phục vụ</p>
            <p className="text-xl font-bold">{servingTables}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Chờ xử lý</p>
            <p className="text-xl font-bold">{pendingOrders}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Doanh thu</p>
            <p className="text-lg font-bold">{todayRevenue.toLocaleString()}đ</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
