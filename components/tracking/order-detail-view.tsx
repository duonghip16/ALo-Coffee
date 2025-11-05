"use client"

import type { Order } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { OrderStatusBadge } from "./order-status-badge"
import { OrderTimeline } from "./order-timeline"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, CreditCard, Package, Clock, User, Receipt, MessageSquare } from "lucide-react"
import { ReviewForm } from "@/components/order/review-form"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"

interface OrderDetailViewProps {
  order: Order
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const { user } = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const createdDate = new Date(order.createdAt)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Order Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-[#FAF6F0] dark:bg-[#3A2C20] shadow-lg border border-[#E4D9C9] dark:border-[#6B4423]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-6 w-6 text-[#C47B3E] dark:text-[#D4A574]" />
              <div>
                <p className="text-sm text-[#8B6F47] dark:text-[#B8A99A]">Mã đơn hàng</p>
                <p className="text-xl font-mono font-bold text-[#3A2C20] dark:text-[#FAF6F0]">{order.code || order.id.slice(0, 8)}</p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#8B6F47] dark:text-[#B8A99A]" />
              <span className="text-[#8B6F47] dark:text-[#B8A99A]">Đặt lúc:</span>
              <span className="font-medium text-[#3A2C20] dark:text-[#FAF6F0]">{createdDate.toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#8B6F47] dark:text-[#B8A99A]" />
              <span className="text-[#8B6F47] dark:text-[#B8A99A]">Số món:</span>
              <span className="font-medium text-[#3A2C20] dark:text-[#FAF6F0]">{Array.isArray(order.items) ? order.items.length : 0} món</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <OrderTimeline order={order} />
      </motion.div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-[#FAF6F0] dark:bg-[#3A2C20] shadow-lg border border-[#E4D9C9] dark:border-[#6B4423]">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-[#C47B3E] dark:text-[#D4A574]" />
            <h3 className="text-lg font-semibold text-[#3A2C20] dark:text-[#FAF6F0]">Chi tiết đơn hàng</h3>
          </div>

          <div className="space-y-4">
            {Array.isArray(order.items) && order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="border border-[#E4D9C9] dark:border-[#6B4423] rounded-lg p-4 bg-[#F7EFE5] dark:bg-[#2A1A12]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-[#3A2C20] dark:text-[#FAF6F0] text-lg">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[#8B6F47] dark:text-[#B8A99A]">
                      <span>Số lượng: {item.quantity}</span>
                      <span>Đơn giá: {item.unitPrice?.toLocaleString()}đ</span>
                    </div>
                    {item.variantId && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Size: {item.variantId}
                      </Badge>
                    )}
                    {item.modifiersChosen && item.modifiersChosen.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-[#8B6F47] dark:text-[#B8A99A] mb-1">Toppings:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.modifiersChosen.map((mod, modIndex) => (
                            <Badge key={modIndex} variant="secondary" className="text-xs">
                              {mod.optionLabel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.note && (
                      <p className="text-xs text-[#8B6F47] dark:text-[#B8A99A] mt-2">
                        <strong>Ghi chú:</strong> {item.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#C47B3E] dark:text-[#D4A574]">
                      {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="border-t border-[#E4D9C9] dark:border-[#6B4423] pt-4 mt-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#3A2C20] dark:text-[#FAF6F0]">
                <span>Tạm tính:</span>
                <span>{order.amounts?.subtotal?.toLocaleString() || order.subtotal?.toLocaleString()}đ</span>
              </div>
              {order.amounts?.discount && order.amounts.discount > 0 && (
                <div className="flex justify-between text-sm text-[#5C8A64]">
                  <span>Giảm giá:</span>
                  <span>-{order.amounts.discount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl border-t border-[#E4D9C9] dark:border-[#6B4423] pt-2">
                <span className="text-[#3A2C20] dark:text-[#FAF6F0]">Tổng cộng:</span>
                <span className="text-[#C47B3E] dark:text-[#D4A574]">
                  {order.amounts?.total?.toLocaleString() || order.total?.toLocaleString()}đ
                </span>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Customer & Delivery Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-[#FAF6F0] dark:bg-[#3A2C20] shadow-lg border border-[#E4D9C9] dark:border-[#6B4423]">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-[#C47B3E] dark:text-[#D4A574]" />
            <h3 className="text-lg font-semibold text-[#3A2C20] dark:text-[#FAF6F0]">Thông tin giao hàng</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-[#3A2C20] dark:text-[#FAF6F0] flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin khách hàng
              </h4>
              <div className="space-y-2 text-sm text-[#3A2C20] dark:text-[#FAF6F0]">
                <p><strong>Loại:</strong> {
                  order.orderType === "dine-in" ? "🍽️ Uống tại quán" :
                  order.orderType === "takeaway" ? "🛍️ Mang đi" :
                  "🚴 Giao hàng"
                }</p>
                <p><strong>Tên:</strong> {order.customerName || "Guest"}</p>
                <p><strong>SĐT:</strong> {order.phone}</p>
                {order.orderType === "dine-in" && order.tableNumber && (
                  <p><strong>Số bàn:</strong> {order.tableNumber}</p>
                )}
                {order.orderType === "delivery" && order.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-[#8B6F47] dark:text-[#B8A99A]" />
                    <div>
                      <p className="font-medium">Địa chỉ giao hàng:</p>
                      <p className="text-[#8B6F47] dark:text-[#B8A99A]">{order.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-[#3A2C20] dark:text-[#FAF6F0] flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Thanh toán
              </h4>
              <div className="space-y-2 text-sm text-[#3A2C20] dark:text-[#FAF6F0]">
                <p><strong>Phương thức:</strong> {order.payment?.method === "vietqr" ? "VietQR" : "COD"}</p>
                <p><strong>Trạng thái:</strong>
                  <Badge
                    variant={order.payment?.status === "paid" ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {order.payment?.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                  </Badge>
                </p>
                {order.payment?.ref && <p><strong>Mã tham chiếu:</strong> {order.payment.ref}</p>}
              </div>
            </div>
          </div>

          {order.notes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-[#FFF9E6] dark:bg-[#4A3B2F] rounded-lg border border-[#E4D9C9] dark:border-[#6B4423]"
            >
              <p className="text-sm">
                <strong className="text-[#8B6F47] dark:text-[#D4A574]">Ghi chú:</strong>
                <span className="text-[#6B5A4A] dark:text-[#B8A99A] ml-2">{order.notes}</span>
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Review Section */}
      {order.status === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-linear-to-br from-[#FAF6F0] to-[#F7EFE5] dark:from-[#3A2C20] dark:to-[#2A1A12] shadow-lg border-2 border-[#C47B3E]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C47B3E] to-[#8E5522] flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A2C20] dark:text-[#FAF6F0]">
                  Cảm ơn bạn đã thưởng thức ALo Coffee ☕
                </h3>
                <p className="text-sm text-[#6B5A4A] dark:text-[#B8A99A]">
                  Hãy chia sẻ cảm nhận để chúng tôi phục vụ tốt hơn
                </p>
              </div>
            </div>

            {!showReviewForm ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReviewForm(true)}
                className="w-full py-3 bg-linear-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#D58A4A] hover:to-[#9F6633] text-white font-semibold rounded-lg transition-all shadow-md"
              >
                ⭐ Đánh giá ngay
              </motion.button>
            ) : (
              <ReviewForm
                orderId={order.id}
                user={user}
                onSuccess={() => setShowReviewForm(false)}
              />
            )}
          </Card>
        </motion.div>
      )}


    </motion.div>
  )
}
