"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, Trash2, Save } from "lucide-react"
import { getAllProducts } from "@/lib/product-service"
import { updateOrderItems } from "@/lib/pos-order-service"
import { doc, updateDoc, collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import type { POSOrder, POSOrderItem } from "@/lib/types/pos"
import type { Product } from "@/lib/firestore-service"
import { toast } from "sonner"

interface OrderEditModalProps {
  order: POSOrder | null
  open: boolean
  onClose: () => void
}

export function OrderEditModal({ order, open, onClose }: OrderEditModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<POSOrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [availableTables, setAvailableTables] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && order) {
      getAllProducts().then(setProducts)
      setItems([...order.items])
      setCustomerName(order.customerName || "")
      setPhone(order.phone || "")
      setTableNumber(order.tableNumber || "")
      setNotes(order.notes || "")
    }
  }, [open, order])

  useEffect(() => {
    if (open) {
      const unsubscribe = onSnapshot(collection(db, "tables"), (snapshot) => {
        const tables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const freeTables = tables.filter((t: any) => t.status === "available" || t.name === order?.tableNumber)
        setAvailableTables(freeTables)
      })
      return () => unsubscribe()
    }
  }, [open, order?.tableNumber])

  if (!order) return null

  const updateQty = (index: number, delta: number) => {
    const newItems = [...items]
    const currentQty = newItems[index].qty || newItems[index].quantity || 0
    newItems[index].qty = Math.max(1, currentQty + delta)
    newItems[index].quantity = newItems[index].qty
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const addItem = (product: Product) => {
    const existingIndex = items.findIndex(i => i.productId === product.id)
    if (existingIndex >= 0) {
      updateQty(existingIndex, 1)
    } else {
      setItems([...items, {
        productId: product.id,
        name: product.name,
        qty: 1,
        quantity: 1,
        unitPrice: product.price,
        status: "queued"
      }])
    }
  }

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("Đơn hàng phải có ít nhất 1 món")
      return
    }

    if (!customerName.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại")
      return
    }

    setLoading(true)
    try {
      const subtotal = items.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.qty || item.quantity || 0)), 0)
      
      await updateDoc(doc(db, "orders", order.id), {
        items,
        customerName: customerName.trim(),
        phone: phone.trim(),
        tableNumber: tableNumber.trim() || null,
        notes: notes.trim() || null,
        subtotal,
        total: subtotal,
        updatedAt: Date.now()
      })
      
      toast.success("Đã cập nhật đơn hàng")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.qty || item.quantity || 0)), 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đơn hàng {order.code}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="items">Món ăn</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4 overflow-y-auto max-h-[calc(90vh-200px)] scroll-smooth pr-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Tên khách hàng *</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <Label>Số điện thoại *</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0123456789"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <Label>Chọn bàn</Label>
              {availableTables.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-2 max-h-[200px] overflow-y-auto scroll-smooth">
                  {availableTables.map((table) => (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => setTableNumber(table.name)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
                        tableNumber === table.name
                          ? "border-[#6B4423] bg-[#6B4423] text-white"
                          : "border-[#E8DCC8] dark:border-[#6B4423] hover:border-[#C47B3E]"
                      }`}
                    >
                      {table.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Không có bàn trống</p>
              )}
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú cho đơn hàng..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="items" className="mt-4 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 h-[calc(90vh-250px)] overflow-hidden">
              <div>
                <h3 className="font-bold mb-3">Thêm món</h3>
                <ScrollArea className="h-full scroll-smooth">
                  <div className="grid grid-cols-2 gap-2 pr-4">
                    {products.map(product => (
                      <Card
                        key={product.id}
                        className="p-3 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => addItem(product)}
                      >
                        <img 
                          src={product.images?.[0] || product.imageUrl || "/placeholder.jpg"} 
                          alt={product.name} 
                          className="w-full h-20 object-cover rounded mb-2" 
                        />
                        <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-green-600">{product.price.toLocaleString()}đ</p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-col">
                <h3 className="font-bold mb-3">Món đã chọn ({items.length})</h3>
                <ScrollArea className="flex-1 mb-3 scroll-smooth">
                  {items.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Chưa có món nào</p>
                  ) : (
                    <div className="space-y-2 pr-4">
                      {items.map((item, index) => {
                        const qty = item.qty || item.quantity || 0
                        const price = item.unitPrice || 0
                        return (
                          <Card key={index} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{price.toLocaleString()}đ</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => updateQty(index, -1)}>
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="font-bold w-8 text-center">{qty}</span>
                                <Button variant="outline" size="sm" onClick={() => updateQty(index, 1)}>
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="font-bold text-green-600">{(price * qty).toLocaleString()}đ</p>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>

                <Card className="p-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-green-600">{total.toLocaleString()}đ</span>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">Hủy</Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
