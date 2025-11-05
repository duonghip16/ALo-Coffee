"use client"

import type { Order } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { OrderStatusBadge } from "./order-status-badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const createdDate = new Date(order.createdAt)

  return (
    <Link href={`/order-tracking/${order.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(createdDate, { addSuffix: true, locale: vi })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Số lượng:</span>
            <span className="font-medium text-coffee-900">{itemCount} mục</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tổng tiền:</span>
            <span className="font-semibold text-coffee-700">{order.total.toLocaleString()}đ</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
