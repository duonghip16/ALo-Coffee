# 📦 Luồng Đặt Hàng & Theo Dõi Đơn Hàng

## ✅ Tính năng đã hoàn thành

### 1. 🛒 Khách hàng đặt hàng (Checkout)
**File:** `app/checkout/page.tsx`

**Quy trình:**
1. Khách hàng thêm sản phẩm vào giỏ hàng
2. Vào trang checkout, điền thông tin:
   - Tên khách hàng *
   - Số điện thoại *
   - Địa chỉ (tùy chọn)
   - Ghi chú (tùy chọn)
3. Chọn phương thức thanh toán:
   - **VietQR**: Hiển thị mã QR để quét
   - **Tiền mặt (COD)**: Thanh toán khi nhận hàng
4. Nhấn "Đặt hàng"
5. Đơn hàng được lưu vào **Firebase Firestore** với:
   - Mã đơn tự động: `ALO123456`
   - Trạng thái: `pending`
   - Trạng thái thanh toán: `pending`
   - Thông tin khách hàng
   - Chi tiết món ăn (tên, số lượng, giá, variant, toppings)

**Code chính:**
```typescript
const orderId = await createOrder({
  userId: user?.uid || "guest",
  customerName: customerName.trim(),
  phone: phone.trim(),
  address: address.trim() || undefined,
  items: items.map(item => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price + (item.variant?.priceDiff || 0) + ...,
    variantId: item.variant?.id,
    modifiersChosen: item.modifiers,
    status: "queued"
  })),
  subtotal: totalAmount,
  discount: 0,
  total: totalAmount,
  payment: {
    method: paymentMethod,
    status: "pending",
    ref: paymentMethod === "vietqr" ? refCode : undefined
  },
  status: "pending",
  notes: note.trim() || undefined
})
```

---

### 2. 👨‍💼 Admin nhận đơn realtime
**File:** `app/admin/orders/page.tsx`

**Quy trình:**
1. Admin vào trang quản lý đơn hàng
2. Hook `useAdminOrders()` tự động subscribe tất cả đơn hàng từ Firestore
3. Khi có đơn mới → **Tự động hiển thị ngay lập tức** (realtime)
4. Admin thấy:
   - Thống kê: Tổng đơn hôm nay, đơn chờ xử lý, đang chuẩn bị, doanh thu
   - Danh sách đơn hàng được nhóm theo ngày
   - Thông tin: Mã đơn, tên khách, SĐT, món ăn, tổng tiền, trạng thái

**Hook realtime:**
```typescript
// hooks/use-admin-orders.ts
export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  
  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data) // Tự động cập nhật khi có thay đổi
    })
    return unsubscribe
  }, [])
  
  return { orders, loading, error }
}
```

**Firestore subscription:**
```typescript
// lib/firestore-service.ts
export function subscribeToAllOrders(callback: (orders: Order[]) => void) {
  const ordersCollection = collection(db, "orders")
  
  return onSnapshot(ordersCollection, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Order[]
    callback(orders) // Gọi callback mỗi khi có thay đổi
  })
}
```

---

### 3. 🔄 Admin cập nhật trạng thái đơn
**File:** `components/admin/order-list-admin.tsx`

**Các trạng thái đơn hàng:**
1. `pending` - Chờ xác nhận
2. `confirmed` - Đã xác nhận
3. `preparing` - Đang chuẩn bị
4. `ready` - Sẵn sàng
5. `completed` - Hoàn thành
6. `cancelled` - Đã hủy

**Các trạng thái món ăn:**
1. `queued` - Chờ làm
2. `making` - Đang làm
3. `ready` - Sẵn sàng

**Admin có thể:**
- Cập nhật trạng thái đơn hàng qua dropdown
- Đánh dấu "Đã nhận tiền" cho đơn COD
- Xem chi tiết đơn trong modal
- Cập nhật trạng thái từng món ăn

**Code cập nhật:**
```typescript
const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
  await updateOrderStatus(orderId, newStatus)
  // Firestore tự động trigger onSnapshot → Admin & Customer đều nhận update
}
```

---

### 4. 📱 Khách hàng theo dõi đơn hàng realtime
**File:** `app/order-tracking/[orderId]/page.tsx`

**Quy trình:**
1. Sau khi đặt hàng, khách được chuyển đến trang theo dõi
2. Hook `useOrderDetail(orderId)` subscribe đơn hàng cụ thể
3. Khi admin cập nhật trạng thái → **Khách thấy ngay lập tức**
4. Hiển thị:
   - Mã đơn hàng
   - Timeline trạng thái (5 bước)
   - Chi tiết món ăn (tên, số lượng, giá, toppings)
   - Thông tin giao hàng
   - Trạng thái thanh toán

**Hook realtime:**
```typescript
// hooks/use-order-detail.ts
export function useOrderDetail(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  
  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (data) => {
      setOrder(data) // Tự động cập nhật khi admin thay đổi
    })
    return unsubscribe
  }, [orderId])
  
  return { order, loading, error }
}
```

**Firestore subscription:**
```typescript
// lib/firestore-service.ts
export function subscribeToOrder(orderId: string, callback: (order: Order | null) => void) {
  const orderDoc = doc(db, "orders", orderId)
  
  return onSnapshot(orderDoc, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as Order)
    }
  })
}
```

---

## 🔥 Firebase Firestore Structure

### Collection: `orders`
```typescript
{
  id: "auto-generated-id",
  code: "ALO123456",
  userId: "user-uid-or-guest",
  customerName: "Nguyễn Văn A",
  phone: "0932653465",
  address: "149/10 Bùi Văn Ngữ, Q12",
  items: [
    {
      productId: "product-id",
      name: "Cà phê sữa đá",
      quantity: 2,
      unitPrice: 25000,
      variantId: "M",
      modifiersChosen: [
        { modifierId: "topping-1", optionLabel: "Thạch", priceDiff: 5000 }
      ],
      note: "",
      status: "queued" | "making" | "ready"
    }
  ],
  subtotal: 50000,
  discount: 0,
  total: 50000,
  amounts: {
    subtotal: 50000,
    discount: 0,
    total: 50000
  },
  payment: {
    method: "cash" | "vietqr",
    status: "pending" | "paid",
    ref: "ALO123456" // Chỉ có khi VietQR
  },
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
  notes: "Ghi chú đơn hàng",
  refCode: "ALO123456", // Chỉ có khi VietQR
  createdAt: 1234567890, // Vietnam timestamp
  updatedAt: 1234567890
}
```

---

## 🎯 Luồng dữ liệu Realtime

```
┌─────────────────┐
│  Khách đặt hàng │
│   (Checkout)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  createOrder()      │
│  → Firestore        │
└────────┬────────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│  Admin Dashboard │   │  Customer Track  │
│  (subscribeAll)  │   │  (subscribeOne)  │
└────────┬─────────┘   └──────────────────┘
         │
         ▼
┌──────────────────┐
│  Admin cập nhật  │
│  updateStatus()  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────┐
│  Firestore trigger  │
│  onSnapshot()       │
└────────┬────────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│  Admin thấy      │   │  Customer thấy   │
│  update ngay     │   │  update ngay     │
└──────────────────┘   └──────────────────┘
```

---

## 🚀 Cách sử dụng

### Khách hàng:
1. Vào `/menu` → Thêm món vào giỏ
2. Vào `/checkout` → Điền thông tin → Đặt hàng
3. Tự động chuyển đến `/order-tracking/[orderId]`
4. Theo dõi trạng thái realtime

### Admin:
1. Vào `/admin/orders`
2. Xem danh sách đơn hàng realtime
3. Cập nhật trạng thái đơn/món
4. Đánh dấu đã thanh toán (nếu COD)

---

## 📝 Files quan trọng

### Frontend (Customer)
- `app/checkout/page.tsx` - Trang đặt hàng
- `app/order-tracking/[orderId]/page.tsx` - Theo dõi đơn
- `components/tracking/order-detail-view.tsx` - Hiển thị chi tiết
- `components/tracking/order-timeline.tsx` - Timeline trạng thái
- `hooks/use-order-detail.ts` - Hook realtime cho 1 đơn

### Backend (Admin)
- `app/admin/orders/page.tsx` - Quản lý đơn hàng
- `components/admin/order-list-admin.tsx` - Danh sách đơn
- `hooks/use-admin-orders.ts` - Hook realtime cho tất cả đơn

### Services
- `lib/firestore-service.ts` - CRUD operations & subscriptions
- `lib/order-service.ts` - Order-specific logic (deprecated, dùng firestore-service)

### State Management
- `hooks/use-cart.ts` - Zustand cart store
- `context/auth-context.tsx` - Firebase Auth context

---

## ✨ Tính năng nổi bật

✅ **Realtime updates** - Không cần refresh trang
✅ **Firestore subscriptions** - onSnapshot tự động
✅ **Mobile-first UI** - Responsive design
✅ **VietQR integration** - Thanh toán QR động
✅ **Order timeline** - 5 bước trực quan
✅ **Item-level tracking** - Theo dõi từng món
✅ **Admin dashboard** - Quản lý tập trung
✅ **Guest checkout** - Không cần đăng nhập

---

Made with ❤️ by ALo Coffee Team
