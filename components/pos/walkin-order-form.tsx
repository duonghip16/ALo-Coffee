"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { getAllProducts } from "@/lib/product-service"
import { createPOSOrder, updateOrderPayment } from "@/lib/pos-order-service"
import { createOrder } from "@/lib/firestore-service"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { useTables } from "@/hooks/use-tables"
import type { POSOrderItem } from "@/lib/types/pos"
import type { Product, User as FirestoreUser } from "@/lib/firestore-service"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface WalkinOrderFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function WalkinOrderForm({ onSuccess, onCancel }: WalkinOrderFormProps) {
  const { user } = useAuth()
  const { tables } = useTables()
  const [customerType, setCustomerType] = useState<"guest" | "registered">("guest")
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<FirestoreUser[]>([])
  const [items, setItems] = useState<POSOrderItem[]>([])
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("takeaway")
  const [selectedTableId, setSelectedTableId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    getAllProducts().then(setProducts)
    getDocs(collection(db, "users")).then(snapshot => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreUser))
      setUsers(usersList.filter(u => u.role === "customer"))
    })
  }, [])

  const categoryMap: Record<string, string> = {
    "Cà phê": "coffee",
    "Trà": "tea",
    "Trà sữa": "smoothie",
    "Nước ngọt": "beverage",
    "Khác": "other"
  }
  
  const categories = ["Cà phê", "Trà", "Trà sữa", "Nước ngọt", "Khác"]
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => {
        const categoryId = categoryMap[selectedCategory]
        if (categoryId === "other") {
          return !['coffee', 'tea', 'smoothie', 'beverage'].includes(p.categoryId)
        }
        return p.categoryId === categoryId
      })

  const addItem = (product: Product) => {
    const existingIndex = items.findIndex(i => i.productId === product.id)
    if (existingIndex >= 0) {
      const newItems = [...items]
      newItems[existingIndex].qty += 1
      setItems(newItems)
    } else {
      setItems([...items, {
        productId: product.id,
        name: product.name,
        qty: 1,
        unitPrice: product.price,
        status: "queued"
      }])
    }
  }

  const updateQty = (index: number, delta: number) => {
    const newItems = [...items]
    newItems[index].qty = Math.max(1, newItems[index].qty + delta)
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)

  const handleQuickPay = async (method: "cash" | "vietqr") => {
    if (items.length === 0) {
      toast.error("Vui lòng thêm món")
      return
    }

    if (customerType === "registered" && !selectedUserId) {
      toast.error("Vui lòng chọn khách hàng")
      return
    }

    if (orderType === "dine-in" && !selectedTableId) {
      toast.error("Vui lòng chọn bàn")
      return
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng")
      return
    }

    setLoading(true)
    try {
      let customerName = ""
      let customerPhone = ""
      let userId = "guest"

      if (customerType === "registered") {
        const selectedUser = users.find(u => u.id === selectedUserId)
        if (selectedUser) {
          customerName = selectedUser.name
          customerPhone = selectedUser.phone
          userId = selectedUser.id
        }
      } else {
        customerName = guestName || "Khách vãng lai"
        customerPhone = guestPhone || ""
      }

      const orderData: any = {
        userId,
        customerName,
        phone: customerPhone,
        orderType,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.qty,
          unitPrice: item.unitPrice,
          status: "queued" as const
        })),
        subtotal,
        discount: 0,
        total: subtotal,
        payment: { method, status: "paid" },
        status: "confirmed" as const
      }

      if (orderType === "dine-in" && selectedTableId) {
        const table = tables.find(t => t.id === selectedTableId)
        orderData.tableNumber = table?.name || selectedTableId
      }

      if (orderType === "delivery" && deliveryAddress) {
        orderData.address = deliveryAddress
      }

      console.log('Creating order with data:', orderData)
      const orderId = await createOrder(orderData)
      console.log('Order created with ID:', orderId)
      toast.success("Tạo đơn hàng thành công")
      onSuccess()
    } catch (error) {
      console.error(error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 h-[calc(85vh-100px)]">
      <div className="flex flex-col overflow-hidden">
        <h3 className="font-bold mb-3 shrink-0">Menu</h3>
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedCategory("all")}
            className={`text-xs ${selectedCategory === "all" ? "bg-[#6B4423] text-white border-[#6B4423] hover:bg-[#8B6F47]" : "border-[#E8DCC8] dark:border-[#6B4423]"}`}
          >
            Tất cả
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant="outline"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs ${selectedCategory === cat ? "bg-[#6B4423] text-white border-[#6B4423] hover:bg-[#8B6F47]" : "border-[#E8DCC8] dark:border-[#6B4423]"}`}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex-1 overflow-y-scroll">
          <div className="grid grid-cols-2 gap-2 pr-2 pb-4">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className="p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={() => addItem(product)}
              >
                <img src={product.imageUrl} alt={product.name} className="w-full h-20 object-cover rounded mb-2 border border-[#E8DCC8] dark:border-[#6B4423]" />
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-green-600">{product.price.toLocaleString()}đ</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <div className="mb-3 shrink-0">
          <h3 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Đơn hàng lẻ
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth pr-2">
        <div className="space-y-2 mb-3 pr-4">
          <div>
            <Label>Loại khách hàng</Label>
            <Select value={customerType} onValueChange={(v: any) => setCustomerType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest">👤 Khách vãng lai</SelectItem>
                <SelectItem value="registered">👥 Khách quen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {customerType === "guest" ? (
            <>
              <Input placeholder="Tên khách (tùy chọn)" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
              <Input placeholder="SĐT (tùy chọn)" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} maxLength={10} />
            </>
          ) : (
            <div>
              <Label>Chọn khách hàng</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} - {u.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-3">
          <div>
            <Label>Loại đơn hàng</Label>
            <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">🍽️ Tại quán</SelectItem>
                <SelectItem value="takeaway">🛍️ Mang đi</SelectItem>
                <SelectItem value="delivery">🚴 Giao hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === "dine-in" && (
            <div>
              <Label>Chọn bàn</Label>
              <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bàn" />
                </SelectTrigger>
                <SelectContent>
                  {tables.filter(t => t.status === "available").map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} {t.area && `- ${t.area}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {orderType === "delivery" && (
            <div>
              <Label>Địa chỉ giao hàng</Label>
              <Input
                placeholder="Nhập địa chỉ"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Chưa có món nào</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.unitPrice.toLocaleString()}đ</p>
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
                      <span className="font-bold w-8 text-center">{item.qty}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQty(index, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-bold text-green-600">{(item.unitPrice * item.qty).toLocaleString()}đ</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="p-4 mb-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-green-600">{subtotal.toLocaleString()}đ</span>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button variant="outline" onClick={onCancel} className="border-[#E8DCC8] dark:border-[#6B4423]">Hủy</Button>
          <Button onClick={() => handleQuickPay("cash")} disabled={loading} className="bg-[#6B4423] hover:bg-[#8B6F47] text-white">
            Tiền mặt
          </Button>
          <Button onClick={() => handleQuickPay("vietqr")} disabled={loading} variant="outline" className="border-[#E8DCC8] dark:border-[#6B4423]">
            VietQR
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
