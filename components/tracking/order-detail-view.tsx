"use client"

import type { Order } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { OrderStatusBadge } from "./order-status-badge"
import { OrderTimeline } from "./order-timeline"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, CreditCard, Package, Clock, User, Receipt } from "lucide-react"

interface OrderDetailViewProps {
  order: Order
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
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
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-6 w-6 text-coffee-700" />
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="text-xl font-mono font-bold text-coffee-900">{order.code || order.id.slice(0, 8)}</p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Đặt lúc:</span>
              <span className="font-medium">{createdDate.toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Số món:</span>
              <span className="font-medium">{Array.isArray(order.items) ? order.items.length : 0} món</span>
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
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-coffee-700" />
            <h3 className="text-lg font-semibold text-coffee-900">Chi tiết đơn hàng</h3>
          </div>

          <div className="space-y-4">
            {Array.isArray(order.items) && order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="border rounded-lg p-4 bg-muted/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-coffee-900 text-lg">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Số lượng: {item.qty || item.quantity}</span>
                      <span>Đơn giá: {(item.unitPrice || item.price)?.toLocaleString()}đ</span>
                    </div>
                    {item.variantId && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Size: {item.variantId}
                      </Badge>
                    )}
                    {item.modifiersChosen && item.modifiersChosen.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Toppings:</p>
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
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Ghi chú:</strong> {item.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-coffee-700">
                      {((item.unitPrice || item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString()}đ
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
            className="border-t border-border pt-4 mt-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{order.amounts?.subtotal?.toLocaleString() || order.subtotal?.toLocaleString()}đ</span>
              </div>
              {order.amounts?.discount && order.amounts.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{order.amounts.discount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl border-t pt-2">
                <span className="text-coffee-900">Tổng cộng:</span>
                <span className="text-coffee-700">
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
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-coffee-700" />
            <h3 className="text-lg font-semibold text-coffee-900">Thông tin giao hàng</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-coffee-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin khách hàng
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Loại:</strong> {
                  order.orderType === "dine-in" ? "🍽️ Uống tại quán" :
                  order.orderType === "takeaway" ? "🛍️ Mang về" :
                  "🚴 Giao hàng"
                }</p>
                <p><strong>Tên:</strong> {order.customerName || "Guest"}</p>
                <p><strong>SĐT:</strong> {order.phone}</p>
                {order.orderType === "dine-in" && order.tableNumber && (
                  <p><strong>Số bàn:</strong> {order.tableNumber}</p>
                )}
                {order.orderType === "delivery" && order.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Địa chỉ giao hàng:</p>
                      <p className="text-muted-foreground">{order.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-coffee-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Thanh toán
              </h4>
              <div className="space-y-2 text-sm">
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
              className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <p className="text-sm">
                <strong className="text-yellow-800">Ghi chú:</strong>
                <span className="text-yellow-700 ml-2">{order.notes}</span>
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
