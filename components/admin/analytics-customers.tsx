"use client"

import { motion } from "framer-motion"
import { Users, UserPlus, UserCheck, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface AnalyticsCustomersProps {
  data: {
    total: number
    new: number
    returning: number
    returnRate: number
  }
}

export function AnalyticsCustomers({ data }: AnalyticsCustomersProps) {
  const pieData = [
    { name: "Khách mới", value: data.new, color: "#2E6" },
    { name: "Khách quay lại", value: data.returning, color: "#C47B3E" }
  ]

  const stats = [
    { title: "Tổng khách hàng", value: data.total, icon: Users, color: "text-[#6B4423]" },
    { title: "Khách hàng mới", value: data.new, icon: UserPlus, color: "text-[#C47B3E]" },
    { title: "Khách quay lại", value: data.returning, icon: UserCheck, color: "text-[#2D5016]" },
    { title: "Tỷ lệ quay lại", value: `${data.returnRate.toFixed(1)}%`, icon: TrendingUp, color: "text-[#8E5522]" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-[#6B4423] rounded-xl p-6 shadow-lg border border-[#E8DCC8] dark:border-[#7B5433]"
    >
      <h3 className="text-xl font-bold text-[#2A1A12] dark:text-white mb-6">Thống kê khách hàng</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-[#FEF7ED] dark:bg-[#7B5433] rounded-lg p-4"
            >
              <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-sm text-[#6B4423] dark:text-[#E8DCC8] mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-[#2A1A12] dark:text-white">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {(data.new > 0 || data.returning > 0) && (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF9F0",
                border: "1px solid #E8DCC8",
                borderRadius: "8px"
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}
