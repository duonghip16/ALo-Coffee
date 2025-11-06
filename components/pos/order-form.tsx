"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { getAllProducts } from "@/lib/product-service"
import { createOrder } from "@/lib/firestore-service"
import { updateTableStatus } from "@/lib/table-service"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import type { Table } from "@/lib/types/pos"
import type { POSOrderItem } from "@/lib/types/pos"
import type { Product, User as FirestoreUser } from "@/lib/firestore-service"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface OrderFormProps {
  table: Table
  onSuccess: () => void
  onCancel: () => void
}

export function OrderForm({ table, onSuccess, onCancel }: OrderFormProps) {
  const { user } = useAuth()
  const [customerType, setCustomerType] = useState<"guest" | "registered">("guest")
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<FirestoreUser[]>([])
  const [items, setItems] = useState<POSOrderItem[]>([])
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllProducts().then(setProducts)
    getDocs(collection(db, "users")).then(snapshot => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreUser))
      setUsers(usersList.filter(u => u.role === "customer"))
    })
  }, [])

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

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Vui lòng thêm món")
      return
    }

    if (customerType === "registered" && !selectedUserId) {
      toast.error("Vui lòng chọn khách hàng")
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

      const orderId = await createOrder({
        userId,
        customerName,
        phone: customerPhone,
        orderType: "dine-in",
        tableNumber: table.name,
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
        payment: { method: "cash", status: "pending" },
        status: "pending",
        notes
      })
      
      // Cập nhật trạng thái bàn
      await updateTableStatus(table.id, "serving", orderId)
      
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
    <div className="grid md:grid-cols-2 gap-4 h-[600px]">
      <div>
        <h3 className="font-bold mb-3">Menu</h3>
        <ScrollArea className="h-[520px]">
          <div className="grid grid-cols-2 gap-2">
            {products.map(product => (
              <Card
                key={product.id}
                className="p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={() => addItem(product)}
              >
                <img src={product.imageUrl} alt={product.name} className="w-full h-20 object-cover rounded mb-2" />
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-green-600">{product.price.toLocaleString()}đ</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-col">
        <div className="mb-3">
          <h3 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {table.name}
          </h3>
        </div>

        <div className="space-y-2 mb-3">
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

        <ScrollArea className="flex-1 mb-3">
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
        </ScrollArea>

        <Card className="p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Tạm tính</span>
            <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
            <span>Tổng cộng</span>
            <span className="text-green-600">{subtotal.toLocaleString()}đ</span>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">Hủy</Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? "Đang xử lý..." : "Tạo đơn"}
          </Button>
        </div>
      </div>
    </div>
  )
}
