"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { CartItem } from "@/components/checkout/cart-item"
import { QRModal } from "@/components/checkout/qr-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { createOrder } from "@/lib/firestore-service"

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán")
      router.push("/auth")
    }
  }, [user, router])
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("takeaway")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "vietqr">("vietqr")
  const [showQR, setShowQR] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const totalAmount = total()

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập")
      return
    }

    if (items.length === 0) {
      toast.error("Giỏ hàng trống")
      return
    }

    if (!customerName.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại")
      return
    }

    const phoneRegex = /^0\d{9}$/
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Số điện thoại phải có 10 số và bắt đầu bằng số 0")
      return
    }

    if (orderType === "dine-in" && !tableNumber.trim()) {
      toast.error("Vui lòng nhập số bàn")
      return
    }

    if (orderType === "delivery" && !address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng")
      return
    }

    setLoading(true)
    try {
      const refCode = `ALO${Date.now().toString().slice(-6)}`
      
      const orderData: any = {
        userId: user?.id || "guest",
        customerName: customerName.trim(),
        phone: phone.trim(),
        orderType,
        items: items.map(item => {
          const cleanItem: any = {
            productId: item.productId || item.id || "",
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price + (item.variant?.priceDiff || 0) + (item.modifiers?.reduce((sum, m) => sum + m.priceDiff, 0) || 0),
            status: "queued"
          }
          if (item.variant?.id) cleanItem.variantId = item.variant.id
          if (item.modifiers && item.modifiers.length > 0) cleanItem.modifiersChosen = item.modifiers
          return cleanItem
        }),
        subtotal: totalAmount,
        discount: 0,
        total: totalAmount,
        payment: {
          method: paymentMethod,
          status: "pending" as const
        },
        status: "pending" as const
      }

      if (paymentMethod === "vietqr") {
        orderData.payment.ref = refCode
        orderData.refCode = refCode
      }
      if (orderType === "dine-in" && tableNumber.trim()) {
        orderData.tableNumber = tableNumber.trim()
      }
      if (orderType === "delivery" && address.trim()) {
        orderData.address = address.trim()
      }
      if (note.trim()) {
        orderData.notes = note.trim()
      }

      console.log('Order data before sending:', JSON.stringify(orderData, null, 2))
      const orderId = await createOrder(orderData)

      if (paymentMethod === "vietqr") {
        setOrderData({
          orderId,
          total: totalAmount,
          refCode,
          qrUrl: `https://img.vietqr.io/image/VCB-1234567890-compact2.jpg?amount=${totalAmount}&addInfo=${refCode}`
        })
        setShowQR(true)
      } else {
        toast.success("Đặt hàng thành công!")
        clear()
        router.push(`/order-tracking/${orderId}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Có lỗi xảy ra khi đặt hàng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7EFE5] dark:bg-[#6f5e48] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#3A2416] dark:text-[#FEF7ED] mb-4 sm:mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Giỏ hàng</h1>

            {items.length === 0 ? (
              <Card className="p-12 text-center bg-white dark:bg-[#8B6F47] border-[#E8DCC8] dark:border-[#6B4423]">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#6B4423] dark:text-[#FEF7ED]" />
                <h2 className="text-xl font-semibold mb-2 text-[#3A2416] dark:text-[#FEF7ED]">Giỏ hàng trống</h2>
                <p className="text-[#3A2416]/70 dark:text-[#FEF7ED]/80 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
                <Button onClick={() => router.push("/menu")} className="bg-[#6B4423] hover:bg-[#8B6F47] text-white">Xem menu</Button>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                  {items.map((item, index) => (
                    <CartItem key={`${item.id}-${index}`} item={item} />
                  ))}
                </div>

                <div>
                  <Card className="p-4 sm:p-6 sticky top-20 sm:top-24 space-y-3 sm:space-y-4 bg-white dark:bg-[#8B6F47] border-[#E8DCC8] dark:border-[#6B4423]">
                    <h2 className="text-lg sm:text-xl font-bold text-[#3A2416] dark:text-[#FEF7ED]">Thông tin đặt hàng</h2>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block text-[#3A2416] dark:text-[#FEF7ED]">
                          Loại đơn hàng *
                        </Label>
                        <RadioGroup value={orderType} onValueChange={(v: any) => setOrderType(v)}>
                          <div className="flex items-center space-x-2 p-2.5 sm:p-3 border border-[#E8DCC8] dark:border-[#6B4423] rounded-lg bg-[#FEF7ED] dark:bg-[#6B4423]">
                            <RadioGroupItem value="dine-in" id="dine-in" />
                            <Label htmlFor="dine-in" className="flex-1 cursor-pointer text-sm sm:text-base text-[#3A2416] dark:text-[#FEF7ED]">
                              🍽️ Uống tại quán
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2.5 sm:p-3 border border-[#E8DCC8] dark:border-[#6B4423] rounded-lg bg-[#FEF7ED] dark:bg-[#6B4423]">
                            <RadioGroupItem value="takeaway" id="takeaway" />
                            <Label htmlFor="takeaway" className="flex-1 cursor-pointer text-sm sm:text-base text-[#3A2416] dark:text-[#FEF7ED]">
                              🛍️ Mang về
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2.5 sm:p-3 border border-[#E8DCC8] dark:border-[#6B4423] rounded-lg bg-[#FEF7ED] dark:bg-[#6B4423]">
                            <RadioGroupItem value="delivery" id="delivery" />
                            <Label htmlFor="delivery" className="flex-1 cursor-pointer text-sm sm:text-base text-[#3A2416] dark:text-[#FEF7ED]">
                              🚴 Giao hàng
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="name" className="text-sm text-[#3A2416] dark:text-[#FEF7ED]">Tên khách hàng *</Label>
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Nhập tên của bạn"
                          className="text-sm h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm text-[#3A2416] dark:text-[#FEF7ED]">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0123456789"
                          pattern="0\d{9}"
                          maxLength={10}
                          title="Số điện thoại phải có 10 số và bắt đầu bằng số 0"
                          className="text-sm h-10"
                        />
                      </div>

                      {orderType === "dine-in" && (
                        <div>
                          <Label htmlFor="table">Số bàn *</Label>
                          <Input
                            id="table"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Ví dụ: B1, B2, B3..."
                          />
                        </div>
                      )}

                      {orderType === "delivery" && (
                        <div>
                          <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                          <Input
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Địa chỉ giao hàng"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                        <Textarea
                          id="note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Ghi chú cho đơn hàng"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-semibold">{totalAmount.toLocaleString()}đ</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-3">
                        <span>Tổng cộng</span>
                        <span className="text-[#6B4423]">{totalAmount.toLocaleString()}đ</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">
                        Phương thức thanh toán
                      </Label>
                      <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                        <div className="flex items-center space-x-2 p-2.5 sm:p-3 border rounded-lg">
                          <RadioGroupItem value="vietqr" id="vietqr" />
                          <Label htmlFor="vietqr" className="flex-1 cursor-pointer text-sm sm:text-base">
                            Chuyển khoản QR
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2.5 sm:p-3 border rounded-lg">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-1 cursor-pointer text-sm sm:text-base">
                            Tiền mặt
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button onClick={handleCheckout} className="w-full" size="lg" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Đặt hàng"}
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {orderData && (
        <QRModal
          open={showQR}
          onClose={() => {
            setShowQR(false)
            clear()
            router.push(`/order-tracking/${orderData.orderId}`)
          }}
          orderData={orderData}
        />
      )}
    </MainLayout>
  )
}
