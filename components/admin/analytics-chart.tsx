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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.4,
        type: "spring",
        stiffness: 80
      }}
      className="bg-white dark:bg-[#3d2817] rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-[#E8DCC8] dark:border-[#6B4423] hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 lg:mb-6">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base lg:text-xl font-extrabold text-[#2A1A12] dark:text-[#FFF9F0]"
        >
          📊 Biểu đồ theo thời gian
        </motion.h3>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType("revenue")}
            className={`flex-1 sm:flex-none px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all duration-300 shadow-md ${
              chartType === "revenue"
                ? "bg-linear-to-r from-[#6B4423] to-[#8B6F47] text-white shadow-lg"
                : "bg-[#F5EFE7] dark:bg-[#5a3d28] text-[#2A1A12] dark:text-[#FFF9F0] hover:bg-[#E8DCC8] dark:hover:bg-[#6B4423]"
            }`}
          >
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 inline mr-1 lg:mr-2" />
            Doanh thu
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType("items")}
            className={`flex-1 sm:flex-none px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all duration-300 shadow-md ${
              chartType === "items"
                ? "bg-linear-to-r from-[#6B4423] to-[#8B6F47] text-white shadow-lg"
                : "bg-[#F5EFE7] dark:bg-[#5a3d28] text-[#2A1A12] dark:text-[#FFF9F0] hover:bg-[#E8DCC8] dark:hover:bg-[#6B4423]"
            }`}
          >
            <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 inline mr-1 lg:mr-2" />
            Sản phẩm
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <ResponsiveContainer width="100%" height={280}>
          {chartType === "revenue" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6B4423" 
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <YAxis 
                stroke="#6B4423" 
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF9F0",
                  border: "2px solid #6B4423",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(107, 68, 35, 0.2)",
                  fontWeight: 600
                }}
                formatter={(value: number) => `${value.toLocaleString()}đ`}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#C47B3E" 
                strokeWidth={4} 
                dot={{ fill: "#8E5522", r: 6 }} 
                activeDot={{ r: 8, fill: "#6B4423" }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6B4423" 
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <YAxis 
                stroke="#6B4423" 
                style={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF9F0",
                  border: "2px solid #6B4423",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(107, 68, 35, 0.2)",
                  fontWeight: 600
                }}
              />
              <Bar 
                dataKey="items" 
                fill="url(#colorGradient)" 
                radius={[12, 12, 0, 0]} 
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B6F47" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#6B4423" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
