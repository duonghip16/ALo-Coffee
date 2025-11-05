"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"

interface AnalyticsChartProps {
  data: Array<{
    date: string
    revenue: number
    orders: number
    items: number
  }>
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [chartType, setChartType] = useState<"revenue" | "items">("revenue")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-[#6B4423] rounded-lg lg:rounded-xl p-3 lg:p-6 shadow-lg border border-[#E8DCC8] dark:border-[#7B5433]"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 lg:mb-6">
        <h3 className="text-sm lg:text-xl font-bold text-[#2A1A12] dark:text-white">Biểu đồ theo thời gian</h3>
        <div className="flex gap-1.5 lg:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setChartType("revenue")}
            className={`flex-1 sm:flex-none px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[10px] lg:text-sm font-bold transition-colors ${
              chartType === "revenue"
                ? "bg-[#6B4423] text-white"
                : "bg-muted dark:bg-[#906b4c] text-[#2A1A12] dark:text-white"
            }`}
          >
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 inline mr-1 lg:mr-2" />
            Doanh thu
          </button>
          <button
            onClick={() => setChartType("items")}
            className={`flex-1 sm:flex-none px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[10px] lg:text-sm font-bold transition-colors ${
              chartType === "items"
                ? "bg-[#6B4423] text-white"
                : "bg-muted dark:bg-[#906b4c] text-[#2A1A12] dark:text-white"
            }`}
          >
            <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 inline mr-1 lg:mr-2" />
            Sản phẩm
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        {chartType === "revenue" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
            <XAxis dataKey="date" stroke="#6B4423" />
            <YAxis stroke="#6B4423" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF9F0",
                border: "1px solid #E8DCC8",
                borderRadius: "8px"
              }}
              formatter={(value: number) => `${value.toLocaleString()}đ`}
            />
            <Line type="monotone" dataKey="revenue" stroke="#C47B3E" strokeWidth={3} dot={{ fill: "#8E5522" }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
            <XAxis dataKey="date" stroke="#6B4423" />
            <YAxis stroke="#6B4423" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF9F0",
                border: "1px solid #E8DCC8",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="items" fill="#6B4423" radius={[8, 8, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
