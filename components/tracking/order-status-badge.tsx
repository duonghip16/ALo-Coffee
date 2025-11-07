"use client"

import type { Order } from "@/lib/firestore-service"

interface OrderStatusBadgeProps {
  status: Order["status"]
}

const STATUS_CONFIG = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800", icon: "⏳" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800", icon: "✓" },
  preparing: { label: "Đang chuẩn bị", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800", icon: "👨‍🍳" },
  ready: { label: "Sẵn sàng", color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800", icon: "📦" },
  completed: { label: "Hoàn thành", color: "bg-[#E8DCC8] dark:bg-[#5A3A1F] text-[#6B4423] dark:text-[#E8DCC8] border border-[#C47B3E] dark:border-[#7B5433]", icon: "✓✓" },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
