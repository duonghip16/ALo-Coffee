"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingBag, RefreshCw, Zap, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface QuickActionsProps {
  onCreateWalkin: () => void
  onQuickMode: () => void
  onAddTable: () => void
  onRefresh: () => void
}

export function QuickActions({ onCreateWalkin, onQuickMode, onAddTable, onRefresh }: QuickActionsProps) {
  return (
    <Card className="p-4">
      <h3 className="font-bold mb-3">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            onClick={onQuickMode} 
            className="w-full flex-col h-auto py-3 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all"
          >
            <Zap className="w-5 h-5 mb-1 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-semibold">Quick Mode</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            onClick={onCreateWalkin} 
            className="w-full flex-col h-auto py-3 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all"
          >
            <ShoppingBag className="w-5 h-5 mb-1 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold">Tạo đơn</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            onClick={onAddTable} 
            className="w-full flex-col h-auto py-3 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mb-1 text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold">Thêm bàn</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            className="w-full flex-col h-auto py-3 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold">Làm mới</span>
          </Button>
        </motion.div>
      </div>
    </Card>
  )
}
