"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface OrderStatsCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function OrderStatsCard({ label, value, icon: Icon, color, trend }: OrderStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer rounded-2xl border-0 bg-white dark:bg-[#6B4423] shadow-[0_2px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.15)] relative overflow-hidden dark:border dark:border-[#7B5433]">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground dark:text-[#E8DCC8] mb-1" style={{ letterSpacing: '0.5px' }}>{label}</p>
            <p className="text-3xl font-bold text-coffee-900 dark:text-[#E8DCC8] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</p>
            {trend && (
              <div className={`flex items-center text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className={`mr-1 ${trend.isPositive ? '↑' : '↓'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span>vs hôm qua</span>
              </div>
            )}
          </div>
          <motion.div 
            className="absolute -right-4 -bottom-4 text-coffee-accent/10 dark:text-coffee-accent/5"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-32 h-32" />
          </motion.div>
          <motion.div 
            className="text-coffee-accent relative z-10"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
