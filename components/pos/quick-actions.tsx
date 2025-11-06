"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingBag, Users, FileText, RefreshCw } from "lucide-react"

interface QuickActionsProps {
  onCreateWalkin: () => void
  onViewOrders: () => void
  onViewInvoices: () => void
  onRefresh: () => void
}

export function QuickActions({ onCreateWalkin, onViewOrders, onViewInvoices, onRefresh }: QuickActionsProps) {
  return (
    <Card className="p-4">
      <h3 className="font-bold mb-3">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button variant="outline" onClick={onCreateWalkin} className="flex-col h-auto py-3">
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-xs">Đơn lẻ</span>
        </Button>
        <Button variant="outline" onClick={onViewOrders} className="flex-col h-auto py-3">
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs">Đơn hàng</span>
        </Button>
        <Button variant="outline" onClick={onViewInvoices} className="flex-col h-auto py-3">
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-xs">Hóa đơn</span>
        </Button>
        <Button variant="outline" onClick={onRefresh} className="flex-col h-auto py-3">
          <RefreshCw className="w-5 h-5 mb-1" />
          <span className="text-xs">Làm mới</span>
        </Button>
      </div>
    </Card>
  )
}
