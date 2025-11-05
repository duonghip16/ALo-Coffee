"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  index?: number
}

export function DashboardCard({ title, value, icon: Icon, subtitle, index = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-[#6B4423] rounded-xl lg:rounded-2xl shadow-[0_2px_8px_rgba(230,218,208,0.4)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_16px_rgba(196,123,62,0.3)] transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-[#FFF9F0] dark:hover:from-[#6B4423] dark:hover:to-[#7B5433] cursor-pointer overflow-hidden relative border border-[#E4D9C9] dark:border-[#7B5433]"
    >
      <div className="p-3 lg:p-5 h-full flex flex-col justify-between relative z-10 min-h-[90px] lg:min-h-[130px]">
        <div>
          <p className="text-[9px] lg:text-xs font-bold text-[#2A1A12] dark:text-[#FFF9F0] uppercase tracking-wide mb-0.5 lg:mb-1">
            {title}
          </p>
          <p className="text-lg lg:text-2xl font-extrabold text-[#2A1A12] dark:text-[#FFF9F0] leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[9px] lg:text-xs font-bold text-[#2A1A12] dark:text-[#FFF9F0] mt-0.5 lg:mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <motion.div
          whileHover={{ scale: 1.15, filter: "drop-shadow(0 0 6px rgba(196, 123, 62, 0.6))" }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4"
        >
          <Icon className="w-6 h-6 lg:w-10 lg:h-10 text-[#C47B3E] dark:text-[#DDB97A] opacity-90" strokeWidth={2} />
        </motion.div>
      </div>
    </motion.div>
  )
}
