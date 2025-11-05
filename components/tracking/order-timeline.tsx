"use client"

import type { Order } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Clock, CheckCircle, ChefHat, Truck, Package, MapPin, Phone, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OrderTimelineProps {
  order: Order
}

const getTimelineSteps = (orderType: 'dine-in' | 'takeaway' | 'delivery') => {
  const baseSteps = [
    {
      status: "pending",
      label: "Đặt hàng",
      description: "Đơn hàng được tạo thành công",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      status: "confirmed",
      label: "Xác nhận",
      description: "Cửa hàng đã xác nhận đơn hàng",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      status: "preparing",
      label: "Chuẩn bị",
      description: "Đang pha chế và chuẩn bị món",
      icon: ChefHat,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      status: "ready",
      label: orderType === "dine-in" ? "Sẵn sàng" : orderType === "takeaway" ? "Sẵn sàng lấy" : "Sẵn sàng giao",
      description: orderType === "dine-in" ? "Món đã sẵn sàng, vui lòng đến quầy" : 
                   orderType === "takeaway" ? "Món đã sẵn sàng, vui lòng đến lấy" :
                   "Đơn hàng đang được giao",
      icon: orderType === "delivery" ? Truck : Package,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  // Chỉ thêm bước "Hoàn thành" cho giao hàng
  if (orderType === "delivery") {
    baseSteps.push({
      status: "completed",
      label: "Hoàn thành",
      description: "Đơn hàng đã được giao thành công",
      icon: CheckCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    })
  }

  return baseSteps
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const TIMELINE_STEPS = getTimelineSteps(order.orderType || 'delivery')
  const currentStepIndex = TIMELINE_STEPS.findIndex((step) => step.status === order.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-coffee-700" />
          <h3 className="text-xl font-semibold text-coffee-900">Trạng thái đơn hàng</h3>
          <Badge variant="outline" className="ml-auto">
            #{order.code || order.id.slice(0, 8)}
          </Badge>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg mb-6"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Thanh toán</p>
              <p className="text-xs text-muted-foreground">
                {order.payment?.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Giao hàng</p>
              <p className="text-xs text-muted-foreground">
                {order.address ? "Địa chỉ cụ thể" : "Tại quán"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-6">
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isNext = index > currentStepIndex
            const Icon = step.icon

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="flex gap-4"
              >
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white shadow-lg"
                        : isCurrent
                        ? `${step.bgColor} border-current ${step.color} shadow-md`
                        : "bg-white border-muted text-muted-foreground"
                    }`}
                    whileHover={isCurrent ? { scale: 1.1 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : isCurrent ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </motion.div>
                  {index < TIMELINE_STEPS.length - 1 && (
                    <motion.div
                      className={`w-0.5 h-16 rounded-full ${
                        isCompleted || isCurrent ? "bg-green-500" : "bg-muted"
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                    />
                  )}
                </div>

                {/* Timeline content */}
                <motion.div
                  className={`pt-1 flex-1 ${isNext ? "opacity-50" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`font-semibold text-lg ${
                        isCompleted || isCurrent ? "text-coffee-900" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Badge className="bg-coffee-100 text-coffee-800 text-xs">
                          Đang xử lý
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                  {/* Estimated time for current step */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground"
                    >
                      {step.status === "preparing" && "⏱️ Dự kiến: 10-15 phút"}
                      {step.status === "ready" && "🚀 Sẵn sàng giao ngay"}
                      {step.status === "confirmed" && "📋 Đang kiểm tra đơn hàng"}
                    </motion.div>
                  )}

                  {/* Completed timestamp */}
                  {isCompleted && order.updatedAt && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-green-600 font-medium"
                    >
                      ✓ Hoàn thành lúc {new Date(order.updatedAt).toLocaleTimeString('vi-VN')}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Tiến độ</span>
            <span>{Math.round(((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-linear-to-r from-coffee-500 to-coffee-700 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100}%` }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
