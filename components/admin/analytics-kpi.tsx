"use client"

import { motion } from "framer-motion"
import { DollarSign, ShoppingBag, Coffee, TrendingUp } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics-service"

interface AnalyticsKPIProps {
  data: AnalyticsData
}

export function AnalyticsKPI({ data }: AnalyticsKPIProps) {
  const kpis = [
    {
      title: "Doanh thu",
      value: `${data.revenue.toLocaleString()}đ`,
      icon: DollarSign,
      color: "from-[#C47B3E] to-[#8E5522]"
    },
    {
      title: "Số đơn hàng",
      value: data.orders,
      icon: ShoppingBag,
      color: "from-[#6B4423] to-[#4e3521]"
    },
    {
      title: "Số ly bán ra",
      value: data.items,
      icon: Coffee,
      color: "from-[#8B6F47] to-[#6B4423]"
    },
    {
      title: "Giá trị TB/đơn",
      value: `${Math.round(data.avgOrderValue).toLocaleString()}đ`,
      icon: TrendingUp,
      color: "from-[#2D5016] to-[#1a3009]"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-gradient-to-br ${kpi.color} rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-lg text-white`}
          >
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <Icon className="h-5 w-5 lg:h-8 lg:w-8 opacity-80" />
            </div>
            <p className="text-[10px] lg:text-sm opacity-90 mb-0.5 lg:mb-1">{kpi.title}</p>
            <p className="text-base lg:text-3xl font-bold leading-tight">{kpi.value}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
