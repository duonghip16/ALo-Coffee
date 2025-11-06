"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAllProducts } from "@/lib/product-service"
import { createPOSOrder, updateOrderPayment } from "@/lib/pos-order-service"
import type { Product } from "@/lib/firestore-service"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { X, Check } from "lucide-react"

interface QuickModeModalProps {
  open: boolean
  onClose: () => void
}

export function QuickModeModal({ open, onClose }: QuickModeModalProps) {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map())
  const [step, setStep] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    if (open) {
      getAllProducts().then(setProducts)
      setSelectedItems(new Map())
      setStep(1)
    }
  }, [open])

  const total = Array.from(selectedItems.entries()).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === id)
    return sum + (product?.price || 0) * qty
  }, 0)

  const handleQuickPay = async (method: "cash" | "vietqr") => {
    if (selectedItems.size === 0) return
    
    try {
      const items = Array.from(selectedItems.entries()).map(([id, qty]) => {
        const product = products.find(p => p.id === id)!
        return {
          productId: id,
          name: product.name,
          qty,
          unitPrice: product.price,
          status: "queued" as const
        }
      })

      const orderId = await createPOSOrder({
        type: "walkin",
        items,
        subtotal: total,
        discount: 0,
        total,
        status: "pending",
        payment: { method, status: "pending" },
        createdBy: user?.uid || "unknown"
      })
      
      await updateOrderPayment(orderId, method)
      toast.success("Thanh toán thành công!")
      onClose()
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogTitle className="sr-only">Quick Mode - Bước {step}/3</DialogTitle>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Quick Mode - {step}/3</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {step === 1 && (
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {products.map(product => {
                  const qty = selectedItems.get(product.id) || 0
                  return (
                    <Card
                      key={product.id}
                      className={`p-3 cursor-pointer transition-all ${qty > 0 ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => {
                        const newMap = new Map(selectedItems)
                        newMap.set(product.id, qty + 1)
                        setSelectedItems(newMap)
                      }}
                    >
                      <img src={product.imageUrl} alt={product.name} className="w-full h-20 object-cover rounded mb-2" />
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      <p className="text-xs text-green-600">{product.price.toLocaleString()}đ</p>
                      {qty > 0 && (
                        <div className="mt-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {qty}
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {Array.from(selectedItems.entries()).map(([id, qty]) => {
                  const product = products.find(p => p.id === id)!
                  return (
                    <Card key={id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">x{qty}</p>
                      </div>
                      <p className="font-bold text-green-600">{(product.price * qty).toLocaleString()}đ</p>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold mb-2">Tổng cộng</p>
                  <p className="text-4xl font-bold text-green-600">{total.toLocaleString()}đ</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => handleQuickPay("cash")} className="w-40">
                    Tiền mặt
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => handleQuickPay("vietqr")} className="w-40">
                    VietQR
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-lg font-bold">
              {selectedItems.size} món - {total.toLocaleString()}đ
            </div>
            <div className="flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((step - 1) as 1 | 2)}>
                  Quay lại
                </Button>
              )}
              {step < 3 && (
                <Button onClick={() => setStep((step + 1) as 2 | 3)} disabled={selectedItems.size === 0}>
                  Tiếp tục
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
