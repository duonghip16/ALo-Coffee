"use client"

import type { Order } from "@/lib/firestore-service"

interface OrderStatusBadgeProps {
  status: Order["status"]
}

const STATUS_CONFIG = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: "✓" },
  preparing: { label: "Đang chuẩn bị", color: "bg-purple-100 text-purple-800", icon: "👨‍🍳" },
  ready: { label: "Sẵn sàng", color: "bg-green-100 text-green-800", icon: "📦" },
  completed: { label: "Hoàn thành", color: "bg-gray-100 text-gray-800", icon: "✓✓" },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
