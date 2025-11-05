"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/context/auth-context"
import { createOrder } from "@/lib/firestore-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { OrderSummary } from "./order-summary"
import { PaymentMethodSelector, type PaymentMethod } from "./payment-method-selector"
import { VietQRPayment } from "./vietqr-payment"
import { CheckCircle, MapPin, Phone, User } from "lucide-react"
import { motion } from "framer-motion"

export function CheckoutForm() {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")

  const cartTotal = total()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!user) {
        throw new Error("Vui lòng đăng nhập")
      }

      if (!customerName.trim() || !phone.trim() || !address.trim()) {
        throw new Error("Vui lòng điền đầy đủ thông tin giao hàng")
      }

      if (items.length === 0) {
        throw new Error("Giỏ hàng trống")
      }

      const newOrderId = await createOrder({
        userId: user.uid,
        code: "",
        channel: "web",
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          qty: item.quantity,
          unitPrice: item.price,
          variantId: item.variant?.id,
          modifiersChosen: item.modifiers,
          status: "queued" as const,
          note: "",
        })),
        amounts: {
          subtotal: cartTotal,
          discount: 0,
          total: cartTotal,
        },
        payment: {
          method: paymentMethod === "cod" ? "cash" : "vietqr",
          status: "pending" as const,
        },
        status: "pending",
        customerName,
        phone,
        address,
        notes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      setOrderId(newOrderId)

      if (paymentMethod === "cod") {
        // For COD, show confirmation immediately
        setTimeout(() => {
          clear()
          router.push(`/order-confirmation/${newOrderId}`)
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tạo đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  if (orderId && paymentMethod === "vietqr") {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VietQRPayment amount={cartTotal} orderId={orderId} />
        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            Sau khi thanh toán, bạn sẽ được chuyển đến trang xác nhận. Vui lòng giữ lại hóa đơn để tra cứu đơn hàng.
          </p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Customer Info */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-coffee-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Thông tin giao hàng
        </h3>

        <div className="space-y-4">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-coffee-900 mb-1">Tên khách hàng</label>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full pl-10"
              required
            />
            <User className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-coffee-900 mb-1">Số điện thoại</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0932653465"
              className="w-full pl-10"
              required
            />
            <Phone className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-coffee-900 mb-1">Địa chỉ giao hàng</label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="149/10 Bùi Văn Ngữ, Phường Hiệp Thành, Quận 12"
              className="w-full pl-10"
              required
            />
            <MapPin className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-coffee-900 mb-1">Ghi chú (tùy chọn)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm cường độ đường, không đá..."
              className="w-full"
            />
          </motion.div>
        </div>
      </Card>

      <OrderSummary />
      <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-transparent hover:scale-105 transition-all"
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-coffee-700 hover:bg-coffee-900 text-white hover:scale-105 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Tạo đơn hàng
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}
