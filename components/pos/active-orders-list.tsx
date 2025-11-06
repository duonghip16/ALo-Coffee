"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePOSOrders } from "@/hooks/use-pos-orders"
import { Clock, DollarSign } from "lucide-react"
import type { POSOrder } from "@/lib/types/pos"

interface ActiveOrdersListProps {
  onSelectOrder: (order: POSOrder) => void
}

const statusConfig = {
  draft: { label: "Nháp", color: "bg-gray-500" },
  pending: { label: "Chờ xử lý", color: "bg-yellow-500" },
  paid: { label: "Đã thanh toán", color: "bg-green-500" },
  completed: { label: "Hoàn thành", color: "bg-blue-500" },
  cancelled: { label: "Đã hủy", color: "bg-red-500" }
}

export function ActiveOrdersList({ onSelectOrder }: ActiveOrdersListProps) {
  const { orders, loading } = usePOSOrders({ status: "pending" })

  if (loading) return <div>Đang tải...</div>

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Đơn hàng đang xử lý ({orders.length})</h2>
      {orders.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          Không có đơn hàng nào
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map(order => {
            const config = statusConfig[order.status]
            return (
              <Card
                key={order.id}
                className="p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => onSelectOrder(order)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold">{order.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.tableId ? `Bàn ${order.tableId}` : "Khách vãng lai"}
                    </p>
                  </div>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    {order.total.toLocaleString()}đ
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {order.items.length} món
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
