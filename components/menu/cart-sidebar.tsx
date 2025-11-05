"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"
// import { motion, AnimatePresence } from "framer-motion"

export function CartSidebar() {
  const { items, total, removeItem, updateQuantity } = useCart()
  const cartTotal = total()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 right-4 bg-coffee-700 hover:bg-coffee-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 z-40 transition-transform hover:scale-105 active:scale-95 min-h-11">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse min-w-5 min-h-5">
              {itemCount}
            </div>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="text-coffee-900">Giỏ hàng ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground">Giỏ hàng trống</p>
          </div>
        ) : (
          <div className="flex flex-col h-full mt-6">
            <div className="flex-1 overflow-y-auto space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-muted rounded-lg animate-in slide-in-from-right-5 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-coffee-900">{item.name}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{item.price.toLocaleString()}đ</p>
                      {item.variant && (
                        <Badge variant="secondary" className="text-xs">
                          {item.variant.name}
                        </Badge>
                      )}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.modifiers.map((mod, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {mod.optionLabel}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-background rounded transition-transform hover:scale-110 active:scale-90 min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-background rounded transition-transform hover:scale-110 active:scale-90 min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded transition-transform hover:scale-110 active:scale-90 min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-semibold text-lg text-coffee-900">
                <span>Tổng:</span>
                <span>{cartTotal.toLocaleString()}đ</span>
              </div>
              <Link href="/checkout" className="w-full">
                <Button className="w-full bg-coffee-700 hover:bg-coffee-900 text-white transition-transform hover:scale-105 active:scale-95 min-h-11">
                  Thanh toán
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
