import jsPDF from "jspdf"
import type { DailyStats, ProductStats } from "./pos-analytics-service"

export function exportAnalyticsPDF(
  dailyStats: DailyStats[],
  topProducts: ProductStats[],
  totalRevenue: number,
  totalOrders: number,
  startDate: string,
  endDate: string
) {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text("BAO CAO DOANH THU", 105, 20, { align: "center" })
  doc.setFontSize(12)
  doc.text("ALo Coffee", 105, 28, { align: "center" })
  
  doc.setFontSize(10)
  doc.text(`Tu ngay: ${new Date(startDate).toLocaleDateString("vi-VN")}`, 20, 45)
  doc.text(`Den ngay: ${new Date(endDate).toLocaleDateString("vi-VN")}`, 20, 52)
  
  doc.setFontSize(14)
  doc.text("TONG QUAN", 20, 65)
  doc.setFontSize(10)
  doc.text(`Tong doanh thu: ${totalRevenue.toLocaleString()}d`, 20, 75)
  doc.text(`Tong don hang: ${totalOrders}`, 20, 82)
  doc.text(`Gia tri TB: ${Math.round(totalRevenue / totalOrders).toLocaleString()}d`, 20, 89)
  
  let y = 105
  doc.setFontSize(14)
  doc.text("DOANH THU THEO NGAY", 20, y)
  y += 10
  doc.setFontSize(9)
  dailyStats.slice(0, 10).forEach(stat => {
    doc.text(`${new Date(stat.date).toLocaleDateString("vi-VN")}`, 20, y)
    doc.text(`${stat.orderCount} don`, 80, y)
    doc.text(`${stat.revenue.toLocaleString()}d`, 140, y)
    y += 7
  })
  
  y += 10
  doc.setFontSize(14)
  doc.text("TOP SAN PHAM BAN CHAY", 20, y)
  y += 10
  doc.setFontSize(9)
  topProducts.slice(0, 10).forEach((product, index) => {
    doc.text(`${index + 1}. ${product.name}`, 20, y)
    doc.text(`SL: ${product.quantity}`, 100, y)
    doc.text(`${product.revenue.toLocaleString()}d`, 140, y)
    y += 7
  })
  
  doc.setFontSize(8)
  doc.text(`Bao cao duoc tao: ${new Date().toLocaleString("vi-VN")}`, 105, 280, { align: "center" })
  
  doc.save(`bao-cao-${startDate}-${endDate}.pdf`)
}

export function exportAnalyticsCSV(dailyStats: DailyStats[], topProducts: ProductStats[]) {
  let csv = "DOANH THU THEO NGAY\n"
  csv += "Ngay,So don,Doanh thu\n"
  dailyStats.forEach(stat => {
    csv += `${stat.date},${stat.orderCount},${stat.revenue}\n`
  })
  
  csv += "\nTOP SAN PHAM\n"
  csv += "Ten,So luong,Doanh thu\n"
  topProducts.forEach(product => {
    csv += `${product.name},${product.quantity},${product.revenue}\n`
  })
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `bao-cao-${Date.now()}.csv`
  link.click()
}
