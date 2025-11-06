"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, Trash2, Save, User, Phone, MapPin, CreditCard, Package, Users } from "lucide-react"
import { getAllProducts } from "@/lib/product-service"
import { updateOrderItems, type Order, type Product } from "@/lib/firestore-service"
import { doc, updateDoc, collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { toast } from "sonner"
import { useUsers } from "@/hooks/use-users"
import { getTables } from "@/lib/table-service"
import type { Table } from "@/lib/types/pos"

interface OrderEditDialogProps {
  order: Order | null
  open: boolean
  onClose: () => void
}

export function OrderEditDialog({ order, open, onClose }: OrderEditDialogProps) {
  const { users } = useUsers()
  const [products, setProducts] = useState<Product[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [items, setItems] = useState<Order["items"]>([])
  const [customerType, setCustomerType] = useState<"walkin" | "registered">("walkin")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")
  const [tableNumber, setTableNumber] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "vietqr">("cash")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && order) {
      getAllProducts().then(setProducts)
      getTables().then(setTables)
      setItems(Array.isArray(order.items) ? [...order.items] : [])
      
      // Determine customer type based on userId
      if (order.userId && order.userId !== "guest") {
        setCustomerType("registered")
        setSelectedUserId(order.userId)
      } else {
        setCustomerType("walkin")
        setSelectedUserId("")
      }
      
      setCustomerName(order.customerName || "")
      setPhone(order.phone || "")
      setOrderType(order.orderType || "dine-in")
      setTableNumber(order.tableNumber || "")
      setAddress(order.address || "")
      setNotes(order.notes || "")
      setPaymentMethod(order.payment?.method || "cash")
      setPaymentStatus(order.payment?.status || "pending")
    }
  }, [open, order])

  // Update customer info when selecting a registered user
  useEffect(() => {
    if (customerType === "registered" && selectedUserId) {
      const selectedUser = users.find(u => u.uid === selectedUserId)
      if (selectedUser) {
        setCustomerName(selectedUser.name)
        setPhone(selectedUser.phone || "")
      }
    }
  }, [customerType, selectedUserId, users])

  if (!order) return null

  const updateQty = (index: number, delta: number) => {
    const newItems = [...items]
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta)
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
        quantity: 1,
        unitPrice: product.price,
        status: "queued" as const
      }])
    }
  }

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("Đơn hàng phải có ít nhất 1 món")
      return
    }
    if (customerType === "registered" && !selectedUserId) {
      toast.error("Vui lòng chọn khách hàng")
      return
    }
    if (customerType === "walkin" && !customerName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng")
      return
    }
    if (customerType === "walkin" && !phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại")
      return
    }

    setLoading(true)
    try {
      const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
      const orderDoc = doc(db, "orders", order.id)
      
      const updateData: any = {
        items,
        userId: customerType === "registered" ? selectedUserId : "guest",
        customerName,
        phone,
        orderType,
        subtotal,
        total: subtotal,
        amounts: {
          subtotal,
          discount: 0,
          total: subtotal
        },
        payment: {
          method: paymentMethod,
          status: paymentStatus,
          ...(order.payment?.ref && { ref: order.payment.ref })
        },
        updatedAt: Date.now()
      }

      if (orderType === "dine-in" && tableNumber) {
        updateData.tableNumber = tableNumber
      }
      if (orderType === "delivery" && address) {
        updateData.address = address
      }
      if (notes) {
        updateData.notes = notes
      }

      await updateDoc(orderDoc, updateData)
      toast.success("Đã cập nhật đơn hàng")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đơn hàng #{order.code}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="items" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Món ăn</TabsTrigger>
            <TabsTrigger value="customer">Khách hàng</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="h-[calc(90vh-180px)]">
            <div className="grid md:grid-cols-2 gap-4 h-full">
              <div>
                <h3 className="font-bold mb-3">Thêm món</h3>
                <ScrollArea className="h-[calc(90vh-240px)]">
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
                <h3 className="font-bold mb-3">Món đã chọn</h3>
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
                              <span className="font-bold w-8 text-center">{item.quantity}</span>
                              <Button variant="outline" size="sm" onClick={() => updateQty(index, 1)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="font-bold text-green-600">{(item.unitPrice * item.quantity).toLocaleString()}đ</p>
                          </div>
                        </Card>
                      ))}
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

          <TabsContent value="customer" className="h-[calc(90vh-180px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                <div>
                  <Label htmlFor="customerType" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Loại khách hàng
                  </Label>
                  <Select value={customerType} onValueChange={(v: any) => setCustomerType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walkin">👤 Khách vãng lai</SelectItem>
                      <SelectItem value="registered">👥 Khách quen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {customerType === "registered" ? (
                  <div>
                    <Label htmlFor="selectedUser" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Chọn khách hàng
                    </Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khách hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(u => u.role === "customer").map(user => (
                          <SelectItem key={user.uid} value={user.uid}>
                            {user.name} {user.phone ? `- ${user.phone}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedUserId && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-semibold">{customerName}</p>
                        <p className="text-xs text-muted-foreground">{phone}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Tên khách hàng
                      </Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nhập tên khách hàng"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="orderType" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Loại đơn hàng
                  </Label>
                  <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dine-in">🍽️ Tại quán</SelectItem>
                      <SelectItem value="takeaway">🛍️ Mang về</SelectItem>
                      <SelectItem value="delivery">🚴 Giao hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderType === "dine-in" && (
                  <div>
                    <Label htmlFor="tableNumber">Chọn bàn</Label>
                    <Select value={tableNumber} onValueChange={setTableNumber}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bàn" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map(table => (
                          <SelectItem key={table.id} value={table.name}>
                            {table.name} {table.area ? `- ${table.area}` : ""} 
                            {table.status === "serving" ? "(Đang phục vụ)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {orderType === "delivery" && (
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ giao hàng
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nhập địa chỉ giao hàng"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú thêm cho đơn hàng"
                    rows={3}
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="payment" className="h-[calc(90vh-180px)]">
            <div className="space-y-4 p-4">
              <Card className="p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thông tin thanh toán
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                    <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">💵 Tiền mặt</SelectItem>
                        <SelectItem value="vietqr">📱 VietQR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="paymentStatus">Trạng thái thanh toán</Label>
                    <Select value={paymentStatus} onValueChange={(v: any) => setPaymentStatus(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">⏳ Chờ thanh toán</SelectItem>
                        <SelectItem value="paid">✅ Đã thanh toán</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span>Tạm tính:</span>
                      <span>{total.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold mt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">{total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 border-t pt-4">
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
