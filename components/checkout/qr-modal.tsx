"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import Image from "next/image"

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
  const [bankAccount, setBankAccount] = useState("1581686879")
  const [bankName, setBankName] = useState("Techcombank")
  const [accountName, setAccountName] = useState("Phạm Quang Cường")
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "payment"))
        if (settingsDoc.exists()) {
          const data = settingsDoc.data()
          if (data.bankAccount) setBankAccount(data.bankAccount)
          if (data.bankName) setBankName(data.bankName)
          if (data.accountName) setAccountName(data.accountName)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])

  const copyRefCode = () => {
    navigator.clipboard.writeText(orderData.refCode)
    setCopiedRef(true)
    toast.success("Đã sao chép nội dung chuyển khoản")
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const copyAccount = () => {
    navigator.clipboard.writeText(bankAccount)
    setCopiedAccount(true)
    toast.success("Đã sao chép số tài khoản")
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Quét mã QR để thanh toán</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border-2 border-coffee-200">
            <Image
              src="/bank.jpg"
              alt="Mã QR thanh toán"
              width={300}
              height={300}
              className="w-full rounded-lg"
            />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#F7EFE5] rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Ngân hàng</p>
              <p className="font-bold text-lg">{bankName}</p>
            </div>

            <div className="p-3 bg-[#F7EFE5] rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Chủ tài khoản</p>
              <p className="font-bold text-lg">{accountName}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F7EFE5] rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Số tài khoản</p>
                <p className="font-bold text-lg">{bankAccount}</p>
              </div>
              <Button size="sm" variant="outline" onClick={copyAccount}>
                {copiedAccount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="p-3 bg-[#F7EFE5] rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Số tiền</p>
              <p className="text-xl font-bold text-[#C47B3E]">
                {orderData.total.toLocaleString()}đ
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F7EFE5] rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nội dung chuyển khoản</p>
                <p className="font-bold text-lg">{orderData.refCode}</p>
              </div>
              <Button size="sm" variant="outline" onClick={copyRefCode}>
                {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  Hướng dẫn thanh toán
                </p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Mở app ngân hàng và quét mã QR</li>
                  <li>Hoặc chuyển khoản thủ công với thông tin trên</li>
                  <li>Nhập đúng nội dung chuyển khoản</li>
                  <li>Chờ xác nhận từ quán (1-2 phút)</li>
                </ol>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-[#C47B3E] hover:bg-[#8E5522]">
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
