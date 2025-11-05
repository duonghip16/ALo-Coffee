"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy } from "lucide-react"
import { toast } from "sonner"

interface QRModalProps {
  open: boolean
  onClose: () => void
  orderData: {
    orderId: string
    total: number
    refCode: string
    qrUrl: string
  }
}

export function QRModal({ open, onClose, orderData }: QRModalProps) {
  const copyRefCode = () => {
    navigator.clipboard.writeText(orderData.refCode)
    toast.success("Đã copy mã thanh toán")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Quét mã QR để thanh toán</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border-2 border-dashed">
            <img
              src={orderData.qrUrl}
              alt="QR Code"
              className="w-full aspect-square object-contain"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Số tiền</p>
                <p className="text-xl font-bold text-coffee-700">
                  {orderData.total.toLocaleString()}đ
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
                <p className="font-mono font-semibold">{orderData.refCode}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={copyRefCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 mb-1">
                  Hướng dẫn thanh toán
                </p>
                <ol className="list-decimal list-inside space-y-1 text-green-800">
                  <li>Mở app ngân hàng và quét mã QR</li>
                  <li>Kiểm tra số tiền và nội dung</li>
                  <li>Xác nhận thanh toán</li>
                  <li>Chờ xác nhận từ quán (1-2 phút)</li>
                </ol>
              </div>
            </div>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
