export type TableStatus = "available" | "serving" | "completed"

export interface Table {
  id: string
  name: string
  status: TableStatus
  area?: string
  capacity?: number
  currentOrderId?: string
  updatedAt: number
  createdAt: number
}

export type OrderType = "dine-in" | "takeaway" | "delivery" | "walkin"
export type OrderStatus = "draft" | "pending" | "paid" | "completed" | "cancelled"

export interface POSOrderItem {
  productId: string
  name: string
  qty: number
  unitPrice: number
  variantId?: string
  modifiersChosen?: Array<{
    modifierId: string
    optionLabel: string
    priceDiff: number
  }>
  note?: string
  status: "queued" | "preparing" | "ready" | "served"
}

export interface POSOrder {
  id: string
  code: string
  tableId?: string
  type: OrderType
  customerId?: string
  guestInfo?: {
    name?: string
    phone?: string
  }
  items: POSOrderItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  payment: {
    method: "cash" | "vietqr" | "card"
    status: "pending" | "paid"
    ref?: string
  }
  createdBy: string
  createdAt: number
  updatedAt: number
  notes?: string
}

export interface Invoice {
  id: string
  orderId: string
  code: string
  total: number
  status: "draft" | "paid" | "printed" | "archived"
  paymentMethod: "cash" | "vietqr" | "card"
  pdfUrl?: string
  printedAt?: number
  createdAt: number
  updatedAt: number
}
