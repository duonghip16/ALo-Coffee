"use client"

import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getVietnamTime } from "@/lib/date-utils"

interface AnalyticsDateFilterProps {
  dateRange: { start: Date; end: Date }
  onChange: (range: { start: Date; end: Date }) => void
}

export function AnalyticsDateFilter({ dateRange, onChange }: AnalyticsDateFilterProps) {
  const setToday = () => {
    const end = getVietnamTime()
    const start = new Date(end)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    onChange({ start, end })
  }

  const setYesterday = () => {
    const end = getVietnamTime()
    end.setDate(end.getDate() - 1)
    const start = new Date(end)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    onChange({ start, end })
  }

  const setLast7Days = () => {
    const end = getVietnamTime()
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    onChange({ start, end })
  }

  const setThisMonth = () => {
    const end = getVietnamTime()
    const start = new Date(end.getFullYear(), end.getMonth(), 1)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    onChange({ start, end })
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={setToday}
        className="px-4 py-2 rounded-lg text-sm font-bold bg-[#6B4423] text-white hover:bg-[#4e3521] transition-colors"
      >
        Hôm nay
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={setYesterday}
        className="px-4 py-2 rounded-lg text-sm font-bold bg-muted dark:bg-[#906b4c] text-[#2A1A12] dark:text-white hover:bg-[#6B4423] hover:text-white transition-colors"
      >
        Hôm qua
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={setLast7Days}
        className="px-4 py-2 rounded-lg text-sm font-bold bg-muted dark:bg-[#906b4c] text-[#2A1A12] dark:text-white hover:bg-[#6B4423] hover:text-white transition-colors"
      >
        7 ngày
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={setThisMonth}
        className="px-4 py-2 rounded-lg text-sm font-bold bg-muted dark:bg-[#906b4c] text-[#2A1A12] dark:text-white hover:bg-[#6B4423] hover:text-white transition-colors"
      >
        Tháng này
      </motion.button>
    </div>
  )
}
