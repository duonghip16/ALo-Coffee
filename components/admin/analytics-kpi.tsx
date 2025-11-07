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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className={`bg-gradient-to-br ${kpi.color} rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-white relative overflow-hidden group`}
          >
            <motion.div 
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            />
            <div className="flex items-center justify-between mb-2 lg:mb-4 relative z-10">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Icon className="h-6 w-6 lg:h-10 lg:w-10 opacity-90" />
              </motion.div>
            </div>
            <p className="text-xs lg:text-sm opacity-90 mb-1 lg:mb-2 font-medium relative z-10">{kpi.title}</p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="text-lg lg:text-3xl font-extrabold leading-tight relative z-10"
            >
              {kpi.value}
            </motion.p>
          </motion.div>
        )
      })}
    </div>
  )
}
