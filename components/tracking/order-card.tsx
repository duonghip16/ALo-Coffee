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
      <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-[#3A2416] border-[#E8DCC8] dark:border-[#5A3A1F] hover:border-[#C47B3E] dark:hover:border-[#C47B3E]">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-[#6B4423]/60 dark:text-[#E8DCC8]/70 font-mono">#{order.id.slice(0, 8)}</p>
            <p className="text-sm text-[#6B4423]/70 dark:text-[#E8DCC8]/80">
              {formatDistanceToNow(createdDate, { addSuffix: true, locale: vi })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="border-t border-[#E8DCC8] dark:border-[#5A3A1F] pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B4423]/70 dark:text-[#E8DCC8]/80">Số lượng:</span>
            <span className="font-medium text-[#2A1A12] dark:text-[#FEF7ED]">{itemCount} mục</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B4423]/70 dark:text-[#E8DCC8]/80">Tổng tiền:</span>
            <span className="font-semibold text-[#6B4423] dark:text-[#C47B3E]">{order.total.toLocaleString()}đ</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
