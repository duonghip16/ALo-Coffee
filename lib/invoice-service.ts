import { db } from "./firebase-client"
import { collection, addDoc, doc, getDoc, updateDoc, getDocs, query, orderBy, where, onSnapshot } from "firebase/firestore"
import { updateTableStatus } from "./table-service"

export async function getInvoices() {
  const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export function subscribeToInvoices(callback: (invoices: any[]) => void) {
  const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(invoices)
  })
}

export async function completeOrderAndCreateInvoice(orderId: string, tableId?: string) {
  try {
    // Lấy thông tin đơn hàng
    const orderDoc = await getDoc(doc(db, "orders", orderId))
    if (!orderDoc.exists()) throw new Error("Order not found")
    
    const orderData = orderDoc.data()
    
    // Tạo hóa đơn
    const invoiceCode = `INV${Date.now().toString().slice(-8)}`
    const invoiceData = {
      orderId,
      orderCode: orderData.code || orderId.slice(0, 8),
      code: invoiceCode,
      
      // Thông tin khách hàng
      userId: orderData.userId,
      customerName: orderData.customerName,
      customerPhone: orderData.phone,
      
      // Thông tin bàn (nếu có)
      tableNumber: orderData.tableNumber,
      
      // Thông tin đơn hàng
      orderType: orderData.orderType,
      items: orderData.items,
      
      // Thông tin thanh toán
      subtotal: orderData.subtotal || orderData.total,
      discount: orderData.discount || 0,
      total: orderData.total,
      paymentMethod: orderData.payment?.method || "cash",
      paymentStatus: "paid",
      
      // Metadata
      status: "paid",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      printedAt: Date.now()
    }
    
    const invoiceRef = await addDoc(collection(db, "invoices"), invoiceData)
    
    // Cập nhật đơn hàng
    await updateDoc(doc(db, "orders", orderId), {
      status: "completed",
      "payment.status": "paid",
      invoiceId: invoiceRef.id,
      updatedAt: Date.now()
    })
    
    // Cập nhật bàn về trạng thái completed
    if (tableId) {
      await updateTableStatus(tableId, "completed")
      
      // Sau 10 giây reset bàn về trống
      setTimeout(async () => {
        await updateTableStatus(tableId, "available")
      }, 10000)
    }
    
    return invoiceRef.id
  } catch (error) {
    console.error("Error completing order:", error)
    throw error
  }
}
