"use client"

import { useCart } from "@/hooks/use-cart"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ShoppingBag, Truck, CreditCard } from "lucide-react"

export function OrderSummary() {
  const { items, total } = useCart()
  const cartTotal = total()
  const shippingFee = 0
  const finalTotal = cartTotal + shippingFee

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-coffee-900 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Tóm tắt đơn hàng
        </h3>

        <div className="space-y-3 mb-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex justify-between text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-muted-foreground">
                {item.name} x {item.quantity}
                {item.variant && <span className="text-xs text-coffee-600"> ({item.variant.name})</span>}
                {item.modifiers && item.modifiers.length > 0 && (
                  <span className="text-xs text-coffee-600">
                    {" "}
                    + {item.modifiers.map(m => m.optionLabel).join(", ")}
                  </span>
                )}
              </span>
              <span className="text-coffee-900 font-medium">{(item.price * item.quantity).toLocaleString()}đ</span>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <motion.div
            className="flex justify-between text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-muted-foreground flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Tạm tính:
            </span>
            <span>{cartTotal.toLocaleString()}đ</span>
          </motion.div>
          <motion.div
            className="flex justify-between text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-muted-foreground flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Phí giao hàng:
            </span>
            <span>{shippingFee.toLocaleString()}đ</span>
          </motion.div>
          <motion.div
            className="border-t border-border pt-2 flex justify-between"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="font-semibold text-coffee-900">Tổng cộng:</span>
            <span className="text-lg font-bold text-coffee-700">{finalTotal.toLocaleString()}đ</span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
