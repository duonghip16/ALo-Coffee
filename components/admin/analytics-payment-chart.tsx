"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"

interface AnalyticsPaymentChartProps {
  data: {
    total: number
    cash: number
    vietqr: number
  }
}

export function AnalyticsPaymentChart({ data }: AnalyticsPaymentChartProps) {
  const maxValue = data.total
  const cashPercent = maxValue > 0 ? (data.cash / maxValue) * 100 : 0
  const vietqrPercent = maxValue > 0 ? (data.vietqr / maxValue) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring" }}
    >
      <Card className="p-6 bg-white dark:bg-[#3d2817] border-2 border-[#E8DCC8] dark:border-[#6B4423] shadow-xl hover:shadow-2xl transition-all duration-300">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="p-2 bg-gradient-to-br from-[#6B4423] to-[#8B6F47] rounded-xl"
          >
            <DollarSign className="h-5 w-5 text-white" />
          </motion.div>
          <h3 className="text-lg font-extrabold text-[#2A1A12] dark:text-[#FFF9F0]">💳 Doanh thu theo phương thức</h3>
        </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, type: "spring" }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">💵 Tiền mặt</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-sm font-extrabold text-green-600 dark:text-green-400"
            >
              {data.cash.toLocaleString()}đ
            </motion.span>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-[#5a3d28] rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cashPercent}%` }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 flex items-center justify-end pr-4 shadow-lg"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xs font-extrabold text-white drop-shadow-md"
              >
                {cashPercent.toFixed(1)}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">📱 VietQR</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-sm font-extrabold text-blue-600 dark:text-blue-400"
            >
              {data.vietqr.toLocaleString()}đ
            </motion.span>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-[#5a3d28] rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${vietqrPercent}%` }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 flex items-center justify-end pr-4 shadow-lg"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 }}
                className="text-xs font-extrabold text-white drop-shadow-md"
              >
                {vietqrPercent.toFixed(1)}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.03 }}
          className="pt-5 mt-5 border-t-2 border-[#E8DCC8] dark:border-[#6B4423] bg-gradient-to-r from-[#FFF9F0] to-[#F5EFE7] dark:from-[#4e3521] dark:to-[#3d2817] rounded-xl p-4 shadow-md"
        >
          <div className="flex justify-between items-center">
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-base font-extrabold text-[#2A1A12] dark:text-[#FFF9F0]"
            >
              💰 Tổng doanh thu
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="text-2xl font-black bg-gradient-to-r from-[#6B4423] to-[#C47B3E] bg-clip-text text-transparent"
            >
              {data.total.toLocaleString()}đ
            </motion.span>
          </div>
        </motion.div>
      </div>
    </Card>
    </motion.div>
  )
}
