"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TableGrid } from "@/components/pos/table-grid"
import { TableForm } from "@/components/pos/table-form"
import { OrderForm } from "@/components/pos/order-form"
import { WalkinOrderForm } from "@/components/pos/walkin-order-form"
import { ActiveOrdersList } from "@/components/pos/active-orders-list"
import { OrderDetailModal } from "@/components/pos/order-detail-modal"
import { InvoiceList } from "@/components/pos/invoice-list"
import { QuickActions } from "@/components/pos/quick-actions"
import { KeyboardShortcuts } from "@/components/pos/keyboard-shortcuts"
import { OfflineIndicator } from "@/components/pos/offline-indicator"
import { QuickModeModal } from "@/components/pos/quick-mode-modal"
import { useTables } from "@/hooks/use-tables"
import { Plus, Zap } from "lucide-react"
import type { Table, POSOrder } from "@/lib/types/pos"

export default function POSPage() {
  const { tables, loading } = useTables()
  const [activeTab, setActiveTab] = useState("tables")
  const [showTableForm, setShowTableForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showWalkinForm, setShowWalkinForm] = useState(false)
  const [showQuickMode, setShowQuickMode] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<POSOrder | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)

  const handleSelectTable = async (table: Table) => {
    setSelectedTable(table)
    if (table.status === "available") {
      setShowOrderForm(true)
    } else if (table.status === "serving" && table.currentOrderId) {
      // Hiển thị chi tiết đơn hàng của bàn
      const { getDoc, doc } = await import("firebase/firestore")
      const { db } = await import("@/lib/firebase-client")
      const orderDoc = await getDoc(doc(db, "orders", table.currentOrderId))
      if (orderDoc.exists()) {
        setSelectedOrder({ id: orderDoc.id, ...orderDoc.data() } as any)
        setShowOrderDetail(true)
      }
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
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#2A1A12] dark:text-[#4e3521]">Hệ thống POS</h1>
                <div className="flex gap-2">
                  <Button onClick={() => setShowQuickMode(true)} variant="outline" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Mode
                  </Button>
                  <Button onClick={() => setShowTableForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bàn
                  </Button>
                </div>
              </div>
            </div>

      <QuickActions
        onCreateWalkin={() => setShowWalkinForm(true)}
        onViewOrders={() => setActiveTab("orders")}
        onViewInvoices={() => setActiveTab("invoices")}
        onRefresh={() => window.location.reload()}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="tables">Bàn ({tables.length})</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
        </TabsList>
        <TabsContent value="tables" className="mt-4">
          <TableGrid tables={tables} onSelectTable={handleSelectTable} />
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <ActiveOrdersList onSelectOrder={(order) => {
            setSelectedOrder(order)
            setShowOrderDetail(true)
          }} />
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <InvoiceList />
        </TabsContent>
      </Tabs>

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

      <OrderDetailModal
        order={selectedOrder}
        open={showOrderDetail}
        onClose={() => {
          setShowOrderDetail(false)
          setSelectedOrder(null)
        }}
      />

      <Dialog open={showWalkinForm} onOpenChange={setShowWalkinForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo đơn hàng lẻ</DialogTitle>
            <DialogDescription>Tạo đơn hàng mang đi hoặc giao hàng</DialogDescription>
          </DialogHeader>
          <WalkinOrderForm
            onSuccess={() => setShowWalkinForm(false)}
            onCancel={() => setShowWalkinForm(false)}
          />
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
