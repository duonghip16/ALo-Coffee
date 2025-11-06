"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getInvoices } from "@/lib/invoice-service"
import { getPOSOrder } from "@/lib/pos-order-service"
import { generateInvoicePDF } from "@/lib/pdf-service"
import type { Invoice } from "@/lib/types/pos"
import { Printer, Calendar } from "lucide-react"
import { toast } from "sonner"

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadInvoices = async () => {
    setLoading(true)
    try {
      const filters = {
        startDate: startDate ? new Date(startDate).getTime() : undefined,
        endDate: endDate ? new Date(endDate).getTime() : undefined
      }
      const data = await getInvoices(filters)
      setInvoices(data)
    } catch (error) {
      toast.error("Không thể tải hóa đơn")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleReprint = async (invoice: Invoice) => {
    try {
      const order = await getPOSOrder(invoice.orderId)
      if (order) {
        await generateInvoicePDF(order, invoice.code)
        toast.success("Đã in lại hóa đơn")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  const statusConfig = {
    draft: { label: "Nháp", color: "bg-gray-500" },
    paid: { label: "Đã thanh toán", color: "bg-green-500" },
    printed: { label: "Đã in", color: "bg-blue-500" },
    archived: { label: "Lưu trữ", color: "bg-purple-500" }
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Từ ngày" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Đến ngày" />
        <Button onClick={loadInvoices}>
          <Calendar className="w-4 h-4 mr-2" />
          Lọc
        </Button>
      </div>

      <div className="grid gap-3">
        {invoices.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Không có hóa đơn nào
          </Card>
        ) : (
          invoices.map(invoice => {
            const config = statusConfig[invoice.status]
            return (
              <Card key={invoice.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold">{invoice.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-green-600">
                    {invoice.total.toLocaleString()}đ
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleReprint(invoice)}>
                    <Printer className="w-4 h-4 mr-2" />
                    In lại
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
