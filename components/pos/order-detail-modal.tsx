"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { completeOrderAndCreateInvoice } from "@/lib/invoice-service"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { OrderEditModal } from "./order-edit-modal"
import type { POSOrder } from "@/lib/types/pos"
import { toast } from "sonner"
import { useState } from "react"
import { Printer, Edit, Trash2, Clock, User, MapPin, CreditCard } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { updateTableStatus } from "@/lib/table-service"

interface OrderDetailModalProps {
  order: POSOrder | null
  open: boolean
  onClose: () => void
}

export function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const isAdmin = user?.role === "admin"

  if (!order) return null

  const handlePayment = async (method: "cash" | "vietqr" | "card") => {
    setLoading(true)
    try {
      const orderRef = doc(db, "orders", order.id)
      const orderSnap = await getDoc(orderRef)
      
      if (!orderSnap.exists()) {
        throw new Error("Đơn hàng không tồn tại")
      }
      
      const orderData = orderSnap.data()
      
      let tableId: string | undefined
      if (orderData?.tableNumber) {
        const tablesQuery = query(collection(db, "tables"), where("name", "==", orderData.tableNumber))
        const tablesSnap = await getDocs(tablesQuery)
        if (!tablesSnap.empty) {
          tableId = tablesSnap.docs[0].id
        }
      }
      
      await updateDoc(orderRef, {
        "payment.method": method
      })
      
      await completeOrderAndCreateInvoice(order.id, tableId)
      toast.success("Thanh toán thành công!")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const handlePrintInvoice = () => {
    toast.info("Chức năng in hóa đơn sẽ được cập nhật sau")
  }

  const handleDelete = async () => {
    if (!confirm(`Xóa đơn hàng ${order.code}?`)) return
    setLoading(true)
    try {
      const orderRef = doc(db, "orders", order.id)
      await updateDoc(orderRef, {
        status: "cancelled",
        updatedAt: Date.now()
      })
      
      const orderSnap = await getDoc(orderRef)
      const orderData = orderSnap.data()
      
      if (orderData?.tableNumber) {
        const tablesQuery = query(collection(db, "tables"), where("name", "==", orderData.tableNumber))
        const tablesSnap = await getDocs(tablesQuery)
        if (!tablesSnap.empty) {
          await updateTableStatus(tablesSnap.docs[0].id, "available")
        }
      }
      
      toast.success("Đã hủy đơn hàng")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = order.subtotal || order.amounts?.subtotal || 0
  const discount = order.discount || order.amounts?.discount || 0
  const total = order.total || order.amounts?.total || 0

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">Chi tiết đơn hàng</DialogTitle>
                <DialogDescription>Mã: {order.code}</DialogDescription>
              </div>
              {isAdmin && order.status === "pending" && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Sửa
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Khách hàng</p>
                    <p className="font-semibold">{order.customerName || order.guestInfo?.name || "Khách vãng lai"}</p>
                    {order.phone && <p className="text-xs text-muted-foreground">{order.phone}</p>}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Thời gian tạo</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bàn / Loại</p>
                    <p className="font-semibold">
                      {order.tableNumber || "Không có bàn"} - {order.type === "dine-in" ? "Tại quán" : order.type === "takeaway" ? "Mang đi" : "Giao hàng"}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phương thức thanh toán</p>
                    <p className="font-semibold capitalize">{order.payment?.method || "Chưa chọn"}</p>
                  </div>
                </div>
                
                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ghi chú</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <div>
              <h3 className="font-bold mb-2">Món đã gọi</h3>
              <div className="space-y-2">
                {order.items?.map((item, index) => {
                  const qty = item.qty || item.quantity || 0
                  const price = item.unitPrice || 0
                  return (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">x{qty}</p>
                        </div>
                        <p className="font-bold">{(price * qty).toLocaleString()}đ</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-green-600">{total.toLocaleString()}đ</span>
                </div>
              </div>
            </Card>

            {order.status === "pending" && (
              <div className="flex gap-2">
                <Button onClick={() => handlePayment("cash")} disabled={loading} className="flex-1">
                  Tiền mặt
                </Button>
                <Button onClick={() => handlePayment("vietqr")} disabled={loading} className="flex-1" variant="outline">
                  VietQR
                </Button>
                <Button onClick={() => handlePayment("card")} disabled={loading} className="flex-1" variant="outline">
                  Thẻ
                </Button>
              </div>
            )}
            {order.status === "paid" && (
              <Button onClick={handlePrintInvoice} disabled={loading} className="w-full">
                <Printer className="w-4 h-4 mr-2" />
                In hóa đơn
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {showEditModal && (
        <OrderEditModal
          order={order}
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            onClose()
          }}
        />
      )}
    </>
  )
}
