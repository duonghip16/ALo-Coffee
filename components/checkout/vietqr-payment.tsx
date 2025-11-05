"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { QrCode, Smartphone, Clock, Copy, Check } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { toast } from "sonner"

interface VietQRPaymentProps {
  amount: number
  orderId: string
}

export function VietQRPayment({ amount, orderId }: VietQRPaymentProps) {
  const [bankAccount, setBankAccount] = useState("1581686879")
  const [bankName, setBankName] = useState("Techcombank")
  const [accountName, setAccountName] = useState("Phạm Quang Cường")
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount)
      setCopied(true)
      toast.success("Đã sao chép số tài khoản")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Không thể sao chép")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-coffee-900 mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Mã QR thanh toán
        </h3>

        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="p-6 bg-white border-2 border-coffee-200 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/bank.jpg"
                alt="Mã QR thanh toán"
                width={250}
                height={250}
                className="w-full rounded-lg"
              />
            </motion.div>

            <div className="w-full space-y-3">
              <div className="bg-[#F7EFE5] dark:bg-[#3A2C20] p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Ngân hàng</p>
                <p className="font-bold text-lg">{bankName}</p>
              </div>

              <div className="bg-[#F7EFE5] dark:bg-[#3A2C20] p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Chủ tài khoản</p>
                <p className="font-bold text-lg">{accountName}</p>
              </div>

              <div className="bg-[#F7EFE5] dark:bg-[#3A2C20] p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Số tài khoản</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-lg">{bankAccount}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Đã sao chép" : "Sao chép"}
                  </Button>
                </div>
              </div>

              <div className="bg-[#F7EFE5] dark:bg-[#3A2C20] p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Số tiền</p>
                <p className="font-bold text-xl text-[#C47B3E]">{amount.toLocaleString()}đ</p>
              </div>

              <div className="bg-[#F7EFE5] dark:bg-[#3A2C20] p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Nội dung chuyển khoản</p>
                <p className="font-bold text-lg">{orderId}</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-coffee-700">
                <Smartphone className="w-4 h-4" />
                <p className="text-sm font-medium">Quét mã QR hoặc chuyển khoản thủ công</p>
              </div>
            </div>

            <motion.div
              className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs text-blue-800 leading-relaxed">
                💡 <strong>Lưu ý:</strong> Vui lòng nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận đơn hàng.
                Nếu có vấn đề, vui lòng liên hệ hotline để được hỗ trợ.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
