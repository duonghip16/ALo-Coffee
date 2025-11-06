import jsPDF from "jspdf"
import type { POSOrder } from "./types/pos"

export async function generateInvoicePDF(order: POSOrder, invoiceCode: string): Promise<void> {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.text("ALo Coffee", 105, 20, { align: "center" })
  doc.setFontSize(10)
  doc.text("Noi ban dung chan giua Sai Gon nhon nhip", 105, 28, { align: "center" })
  
  // Invoice info
  doc.setFontSize(16)
  doc.text("HOA DON", 105, 45, { align: "center" })
  doc.setFontSize(10)
  doc.text(`Ma: ${invoiceCode}`, 20, 60)
  doc.text(`Ngay: ${new Date(order.createdAt).toLocaleString("vi-VN")}`, 20, 68)
  
  if (order.tableId) {
    doc.text(`Ban: ${order.tableId}`, 20, 76)
  }
  if (order.guestInfo?.name) {
    doc.text(`Khach: ${order.guestInfo.name}`, 20, 84)
  }
  
  // Items
  let y = 100
  doc.setFontSize(12)
  doc.text("Mon", 20, y)
  doc.text("SL", 120, y)
  doc.text("Thanh tien", 160, y)
  
  doc.line(20, y + 2, 190, y + 2)
  y += 10
  
  doc.setFontSize(10)
  order.items.forEach(item => {
    doc.text(item.name, 20, y)
    doc.text(item.qty.toString(), 120, y)
    doc.text(`${(item.unitPrice * item.qty).toLocaleString()}d`, 160, y)
    y += 8
  })
  
  // Total
  y += 5
  doc.line(20, y, 190, y)
  y += 10
  doc.setFontSize(12)
  doc.text("Tam tinh:", 120, y)
  doc.text(`${order.subtotal.toLocaleString()}d`, 160, y)
  
  if (order.discount > 0) {
    y += 8
    doc.text("Giam gia:", 120, y)
    doc.text(`-${order.discount.toLocaleString()}d`, 160, y)
  }
  
  y += 10
  doc.setFontSize(14)
  doc.text("TONG CONG:", 120, y)
  doc.text(`${order.total.toLocaleString()}d`, 160, y)
  
  // Footer
  y += 20
  doc.setFontSize(10)
  doc.text("Cam on quy khach!", 105, y, { align: "center" })
  doc.text("Hen gap lai!", 105, y + 8, { align: "center" })
  
  // Save
  doc.save(`invoice-${invoiceCode}.pdf`)
}
