"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { generateQRCode } from "@/lib/vietqr-service"
import Image from "next/image"
import { motion } from "framer-motion"
import { QrCode, Smartphone, Clock } from "lucide-react"

interface VietQRPaymentProps {
  amount: number
  orderId: string
}

export function VietQRPayment({ amount, orderId }: VietQRPaymentProps) {
  const [qrCode, setQrCode] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQR = async () => {
      try {
        // Replace with your actual bank account details
        const qr = await generateQRCode({
          amount,
          description: `ALo Coffee Order ${orderId}`,
          accountNumber: "1021387919", // Replace with actual account
          bankCode: "970422", // Techcombank - replace with your bank
        })
        setQrCode(qr)
      } catch (error) {
        console.error("Error generating QR:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQR()
  }, [amount, orderId])

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

        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-80 bg-muted/50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <p className="text-sm text-muted-foreground">Đang tạo mã QR...</p>
            </div>
          </motion.div>
        ) : qrCode ? (
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
                src={qrCode || "/placeholder.svg"}
                alt="VietQR"
                width={250}
                height={250}
                className="w-full rounded-lg"
              />
            </motion.div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-coffee-700">
                <Smartphone className="w-4 h-4" />
                <p className="text-sm font-medium">Quét mã QR bằng ứng dụng ngân hàng</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <p className="text-xs">Số tiền: <span className="font-semibold text-coffee-900">{amount.toLocaleString()}đ</span></p>
              </div>
            </div>

            <motion.div
              className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs text-blue-800 leading-relaxed">
                💡 <strong>Lưu ý:</strong> Sau khi thanh toán thành công, hệ thống sẽ tự động xác nhận đơn hàng.
                Nếu có vấn đề, vui lòng liên hệ hotline để được hỗ trợ.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center p-6 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <QrCode className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Không thể tạo mã QR</p>
            <p className="text-sm text-red-600 mt-1">Vui lòng thử lại hoặc chọn phương thức khác</p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
