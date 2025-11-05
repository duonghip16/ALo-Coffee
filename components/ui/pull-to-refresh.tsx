"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  className?: string
}

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const y = useMotionValue(0)
  const rotate = useTransform(y, [0, 80], [0, 360])

  useEffect(() => {
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY)
        isDragging = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || window.scrollY > 0) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startY

      if (diff > 0) {
        e.preventDefault()
        y.set(Math.min(diff * 0.5, 80))
      }
    }

    const handleTouchEnd = async () => {
      if (!isDragging) return

      const currentY = y.get()
      isDragging = false

      if (currentY > 60 && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      y.set(0)
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [y, startY, onRefresh, isRefreshing])

  return (
    <div className={className}>
      <motion.div
        style={{ y }}
        className="relative"
      >
        <motion.div
          className="flex items-center justify-center py-4"
          style={{ rotate }}
        >
          <RefreshCw className="h-6 w-6 text-coffee-700" />
          <span className="ml-2 text-sm text-coffee-700">
            {isRefreshing ? "Đang làm mới..." : "Kéo để làm mới"}
          </span>
        </motion.div>
        {children}
      </motion.div>
    </div>
  )
}
