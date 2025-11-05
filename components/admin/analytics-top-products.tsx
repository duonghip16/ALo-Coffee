"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp } from "lucide-react"
import Image from "next/image"

interface AnalyticsTopProductsProps {
  products: Array<{
    id: string
    name: string
    quantity: number
    revenue: number
    imageUrl?: string
  }>
}

export function AnalyticsTopProducts({ products }: AnalyticsTopProductsProps) {
  const maxQuantity = Math.max(...products.map(p => p.quantity), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-[#6B4423] rounded-xl p-6 shadow-lg border border-[#E8DCC8] dark:border-[#7B5433]"
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-[#C47B3E]" />
        <h3 className="text-xl font-bold text-[#2A1A12] dark:text-white">Top 10 món bán chạy</h3>
      </div>

      <div className="space-y-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            className="flex items-center gap-4 p-3 bg-[#FEF7ED] dark:bg-[#7B5433] rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C47B3E] text-white font-bold text-sm">
              {index + 1}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-[#2A1A12] dark:text-white mb-1">{product.name}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#6B4423] dark:text-[#E8DCC8]">
                  <strong>{product.quantity}</strong> ly
                </span>
                <span className="text-[#2D5016] dark:text-[#90EE90]">
                  <strong>{product.revenue.toLocaleString()}đ</strong>
                </span>
              </div>
              
              <div className="mt-2 h-2 bg-[#E8DCC8] dark:bg-[#906b4c] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(product.quantity / maxQuantity) * 100}%` }}
                  transition={{ delay: 0.8 + index * 0.05, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#C47B3E] to-[#8E5522]"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có dữ liệu sản phẩm
        </div>
      )}
    </motion.div>
  )
}
