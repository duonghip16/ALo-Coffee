"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TableGrid } from "@/components/pos/table-grid"
import { TableForm } from "@/components/pos/table-form"
import { OrderForm } from "@/components/pos/order-form"
import { WalkinOrderForm } from "@/components/pos/walkin-order-form"

import { QuickActions } from "@/components/pos/quick-actions"
import { KeyboardShortcuts } from "@/components/pos/keyboard-shortcuts"
import { OfflineIndicator } from "@/components/pos/offline-indicator"
import { QuickModeModal } from "@/components/pos/quick-mode-modal"
import { useTables } from "@/hooks/use-tables"
import { Plus, Zap } from "lucide-react"
import { motion } from "framer-motion"
import type { Table } from "@/lib/types/pos"

export default function POSPage() {
  const { tables, loading } = useTables()
  const [showTableForm, setShowTableForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showWalkinForm, setShowWalkinForm] = useState(false)
  const [showQuickMode, setShowQuickMode] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const handleSelectTable = (table: Table) => {
    setSelectedTable(table)
    if (table.status === "available") {
      setShowOrderForm(true)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF6F0] dark:bg-[#EDE3D4]">
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        
        <main className="flex-1 overflow-auto ml-20 lg:ml-64">
          <div className="max-w-7xl mx-auto px-3 lg:px-6 py-4 lg:py-8">
            <OfflineIndicator />
            <KeyboardShortcuts
              onCreateWalkin={() => setShowWalkinForm(true)}
              onRefresh={() => window.location.reload()}
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-[#3d2817] rounded-2xl p-4 lg:p-6 shadow-xl border-2 border-[#E8DCC8] dark:border-[#6B4423]">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl lg:text-4xl font-black text-[#2A1A12] dark:text-[#FFF9F0]" 
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  💳 Hệ thống POS
                </motion.h1>
              </div>
            </motion.div>

      <QuickActions
        onQuickMode={() => setShowQuickMode(true)}
        onCreateWalkin={() => setShowWalkinForm(true)}
        onAddTable={() => setShowTableForm(true)}
        onRefresh={() => window.location.reload()}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <TableGrid tables={tables} onSelectTable={handleSelectTable} />
      </motion.div>

      <Dialog open={showTableForm} onOpenChange={setShowTableForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm bàn mới</DialogTitle>
            <DialogDescription>Tạo bàn mới cho quán</DialogDescription>
          </DialogHeader>
          <TableForm
            onSuccess={() => setShowTableForm(false)}
            onCancel={() => setShowTableForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo đơn hàng</DialogTitle>
            <DialogDescription>Tạo đơn hàng cho bàn</DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <OrderForm
              table={selectedTable}
              onSuccess={() => {
                setShowOrderForm(false)
                setSelectedTable(null)
              }}
              onCancel={() => {
                setShowOrderForm(false)
                setSelectedTable(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showWalkinForm} onOpenChange={setShowWalkinForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-[#d8c1a3] dark:bg-[#312316]">
          <DialogHeader className="shrink-0">
            <DialogTitle>Tạo đơn hàng lẻ</DialogTitle>
            <DialogDescription>Tạo đơn hàng mang đi hoặc giao hàng</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <WalkinOrderForm
              onSuccess={() => setShowWalkinForm(false)}
              onCancel={() => setShowWalkinForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

            <QuickModeModal
              open={showQuickMode}
              onClose={() => setShowQuickMode(false)}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
