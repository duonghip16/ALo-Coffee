"use client"

import type { Order } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { updateOrderStatus, updateOrderPaymentStatus, updateItemStatus } from "@/lib/firestore-service"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Clock, CheckCircle, ChefHat, Truck, Package, CreditCard, MapPin, Phone, User, Eye, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatVietnamDate, isToday } from "@/lib/date-utils"

interface OrderListAdminProps {
  orders: Order[]
}

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Chờ xác nhận" },
  confirmed: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle, label: "Đã xác nhận" },
  preparing: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: ChefHat, label: "Đang chuẩn bị" },
  ready: { color: "bg-green-100 text-green-800 border-green-200", icon: Package, label: "Sẵn sàng" },
  completed: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle, label: "Hoàn thành" },
  paid: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Đã thanh toán" },
  cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: Clock, label: "Đã hủy" },
}

const PAYMENT_STATUS_CONFIG = {
  pending: { color: "bg-orange-100 text-orange-800", label: "Chờ thanh toán" },
  paid: { color: "bg-green-100 text-green-800", label: "Đã thanh toán" },
  failed: { color: "bg-red-100 text-red-800", label: "Thanh toán thất bại" },
}

export function OrderListAdmin({ orders }: OrderListAdminProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Nhóm đơn hàng theo ngày
  const groupedOrders = orders.reduce((groups, order) => {
    const date = formatVietnamDate(order.createdAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(order)
    return groups
  }, {} as Record<string, Order[]>)

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => {
    const dateA = groupedOrders[a][0].createdAt
    const dateB = groupedOrders[b][0].createdAt
    return dateB - dateA
  })

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdating(orderId)
    setError("")
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật")
    } finally {
      setUpdating(null)
    }
  }

  const handleMarkPaid = async (orderId: string) => {
    setUpdating(orderId)
    setError("")
    try {
      await updateOrderPaymentStatus(orderId, "paid")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật thanh toán")
    } finally {
      setUpdating(null)
    }
  }

  const handleItemStatusChange = async (orderId: string, itemId: number, newStatus: "queued" | "making" | "ready") => {
    setUpdating(`${orderId}-${itemId}`)
    setError("")
    try {
      await updateItemStatus(orderId, itemId, newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật món")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <Card className="p-6 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không có đơn hàng nào</p>
        </Card>
      ) : (
        sortedDates.map((date) => {
          const dayOrders = groupedOrders[date]
          const totalRevenue = dayOrders.reduce((sum, order) => sum + (order.amounts?.total || order.total || 0), 0)
          const isCurrentDay = isToday(dayOrders[0].createdAt)
          
          return (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center justify-between p-4 bg-linear-to-r from-[#6B4423] to-[#8B6F47] dark:from-[#3A2416] dark:to-[#6B4423] rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#FEF7ED]" />
                  <div>
                    <h3 className="text-lg font-bold text-[#FEF7ED]">
                      {isCurrentDay ? "Hôm nay" : date}
                    </h3>
                    <p className="text-sm text-[#FEF7ED]/80">{dayOrders.length} đơn hàng</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#FEF7ED]/80">Doanh thu</p>
                  <p className="text-xl font-bold text-[#FEF7ED]">{totalRevenue.toLocaleString()}đ</p>
                </div>
              </div>

              {/* Orders for this date */}
              {dayOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-2.5 lg:p-4 bg-white dark:bg-[#6B4423] hover:shadow-md transition-shadow border-[#E4D9C9] dark:border-[#7B5433]">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-2.5 lg:gap-4">
                {/* Order ID & Customer */}
                <div className="lg:col-span-1 border-b lg:border-b-0 pb-2.5 lg:pb-0">
                  <div className="flex items-center justify-between lg:block">
                    <div>
                      <p className="text-[10px] lg:text-xs font-bold text-[#2A1A12] dark:text-[#FFF9F0] font-mono">#{order.code || order.id.slice(0, 8)}</p>
                      <Badge variant="outline" className="text-[10px] lg:text-xs mb-1">
                        {order.orderType === "dine-in" ? "🍽️ Tại quán" : 
                         order.orderType === "takeaway" ? "🛍️ Mang về" : "🚴 Giao hàng"}
                      </Badge>
                    </div>
                    {STATUS_CONFIG[order.status] && (
                      <Badge className={`text-[10px] lg:text-xs font-medium border lg:hidden ${STATUS_CONFIG[order.status].color}`}>
                        {(() => {
                          const Icon = STATUS_CONFIG[order.status].icon
                          return <Icon className="h-3 w-3 mr-1" />
                        })()}
                        {STATUS_CONFIG[order.status].label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <User className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#2A1A12] dark:text-[#FFF9F0]" />
                    <p className="font-bold text-[#2A1A12] dark:text-[#FFF9F0] text-xs lg:text-sm truncate">{order.customerName || "Guest"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#2A1A12] dark:text-[#FFF9F0]" />
                    <p className="text-[10px] lg:text-xs font-semibold text-[#2A1A12] dark:text-[#FFF9F0]">{order.phone}</p>
                  </div>
                  {order.orderType === "dine-in" && order.tableNumber && (
                    <p className="text-[10px] lg:text-xs font-semibold text-[#2A1A12] dark:text-[#FFF9F0]">🍽️ Bàn: {order.tableNumber}</p>
                  )}
                </div>

                {/* Items */}
                <div className="lg:col-span-1">
                  <p className="text-xs lg:text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0]">
                    {Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0} mục
                  </p>
                  <p className="text-[10px] lg:text-xs font-semibold text-[#2A1A12] dark:text-[#FFF9F0] line-clamp-2">
                    {Array.isArray(order.items) ? order.items.map((item) => item.name).join(", ") : ""}
                  </p>
                </div>

                {/* Total & Payment */}
                <div className="lg:col-span-1">
                  <p className="text-sm lg:text-base font-extrabold text-[#2A1A12] dark:text-[#FFF9F0]">{order.amounts?.total?.toLocaleString() || order.total?.toLocaleString()}đ</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CreditCard className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#2A1A12] dark:text-[#FFF9F0]" />
                    <Badge variant="outline" className={`text-[10px] lg:text-xs ${PAYMENT_STATUS_CONFIG[order.payment?.status || "pending"].color}`}>
                      {PAYMENT_STATUS_CONFIG[order.payment?.status || "pending"].label}
                    </Badge>
                  </div>
                </div>

                {/* Status - Desktop only */}
                <div className="hidden lg:block lg:col-span-1">
                  {STATUS_CONFIG[order.status] && (
                    <Badge className={`text-[10px] lg:text-xs font-medium border ${STATUS_CONFIG[order.status].color}`}>
                      {(() => {
                        const Icon = STATUS_CONFIG[order.status].icon
                        return <Icon className="h-3 w-3 mr-1" />
                      })()}
                      {STATUS_CONFIG[order.status].label}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex flex-col gap-2 border-t lg:border-t-0 pt-2.5 lg:pt-0">
                  <div className="flex flex-col lg:flex-row gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order["status"])}
                      disabled={updating === order.id}
                    >
                      <SelectTrigger className="text-[10px] lg:text-xs flex-1 h-8 lg:h-9">
                        <SelectValue placeholder="Cập nhật trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                        <SelectItem value="ready">Sẵn sàng</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>

                    {order.payment?.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkPaid(order.id)}
                        disabled={updating === order.id}
                        className="text-[10px] lg:text-xs w-full lg:w-auto h-8 lg:h-9"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Đã nhận tiền
                      </Button>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-[10px] lg:text-xs w-full dark:text-white dark:hover:bg-[#5A3420] h-8 lg:h-9">
                        <Eye className="h-3 w-3 mr-1" />
                        Chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] lg:max-w-2xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Đơn hàng #{order.code || order.id.slice(0, 8)}</DialogTitle>
                      </DialogHeader>

                      {/* Order Details */}
                      <div className="space-y-4">
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Thông tin khách hàng</h4>
                            <div className="space-y-1 text-sm">
                              <p><User className="inline h-3 w-3 mr-1" />{order.customerName || "Guest"}</p>
                              <p><Phone className="inline h-3 w-3 mr-1" />{order.phone}</p>
                              {order.address && <p><MapPin className="inline h-3 w-3 mr-1" />{order.address}</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Thanh toán</h4>
                            <div className="space-y-1 text-sm">
                              <p>Phương thức: {order.payment?.method === "vietqr" ? "VietQR" : "COD"}</p>
                              <p>Trạng thái: <Badge className={PAYMENT_STATUS_CONFIG[order.payment?.status || "pending"].color}>
                                {PAYMENT_STATUS_CONFIG[order.payment?.status || "pending"].label}
                              </Badge></p>
                              {order.payment?.ref && <p>Ref: {order.payment.ref}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Chi tiết món</h4>
                          <div className="space-y-3">
                            {Array.isArray(order.items) && order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Số lượng: {item.quantity || 0} × {item.unitPrice?.toLocaleString()}đ
                                    </p>
                                    {item.variantId && <p className="text-xs text-muted-foreground">Size: {item.variantId}</p>}
                                    {item.modifiersChosen && item.modifiersChosen.length > 0 && (
                                      <p className="text-xs text-muted-foreground">
                                        Toppings: {item.modifiersChosen.map(m => m.optionLabel).join(", ")}
                                      </p>
                                    )}
                                    {item.note && <p className="text-xs text-muted-foreground">Ghi chú: {item.note}</p>}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">{((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString()}đ</p>
                                    <Select
                                      value={item.status || "queued"}
                                      onValueChange={(value) => handleItemStatusChange(order.id, itemIndex, value as "queued" | "making" | "ready")}
                                      disabled={updating === `${order.id}-${itemIndex}`}
                                    >
                                      <SelectTrigger className="w-32 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="queued">Chờ làm</SelectItem>
                                        <SelectItem value="making">Đang làm</SelectItem>
                                        <SelectItem value="ready">Sẵn sàng</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t pt-4">
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
                          <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                            <span>Tổng cộng:</span>
                            <span className="text-coffee-700">{order.amounts?.total?.toLocaleString() || order.total?.toLocaleString()}đ</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm"><strong>Ghi chú:</strong> {order.notes}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          </motion.div>
              ))}
            </div>
          )
        })
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
