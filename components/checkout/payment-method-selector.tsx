"use client"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { QrCode, Truck } from "lucide-react"

export type PaymentMethod = "vietqr" | "cod"

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-coffee-900 mb-4">Phương thức thanh toán</h3>

        <RadioGroup value={value} onValueChange={(val) => onChange(val as PaymentMethod)}>
          <div className="space-y-3">
            <motion.div
              className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-coffee-50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RadioGroupItem value="vietqr" id="vietqr" />
              <Label htmlFor="vietqr" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <QrCode className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-coffee-900">VietQR (Chuyển khoản)</div>
                  <div className="text-sm text-muted-foreground">Quét mã QR để thanh toán nhanh chóng</div>
                </div>
              </Label>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-coffee-50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-coffee-900">Thanh toán khi nhận hàng</div>
                  <div className="text-sm text-muted-foreground">COD - Trả tiền khi giao hàng tận nơi</div>
                </div>
              </Label>
            </motion.div>
          </div>
        </RadioGroup>
      </Card>
    </motion.div>
  )
}
