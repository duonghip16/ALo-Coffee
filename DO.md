# ✅ TODO.md – ALo Coffee Project Specification
Version: 1.0  
Author: Phạm Quang Dương (hip@DUONG-HIP)

---

## 🧠 Mục tiêu tổng thể
Xây dựng web/app quán cà phê **ALo Coffee** hiện đại, chuyên nghiệp, có khả năng đặt món, thanh toán QR, tích điểm, và quản lý admin.

---

## ⚙️ Tech Stack
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS + Framer Motion + Shadcn/UI  
- **Backend:** Firebase (Auth, Firestore, Cloud Functions)  
- **Storage:** Cloudinary (ảnh menu, logo, banner)  
- **Deployment:** Vercel  
- **Optional:** PWA (standalone, offline-ready)

---

## 🚀 Mục tiêu UX/UI
- Tone màu: nâu café (#4B2E05), be (#F5E6CA), trắng (#FFFFFF)
- Font: Playfair Display (title) + Inter/Poppins (body)
- Hiệu ứng: Framer Motion fade/slide, parallax nhẹ, hover scale 1.05
- Phong cách: ấm áp, tối giản, hiện đại, chuyên nghiệp
- Responsive (mobile-first)

---

## 🧭 Luồng chính (User Flow)
[Home]
├──> [Menu]
│ ├──> [Chi tiết món]
│ ├──> [Thêm vào giỏ]
│ └──> [Cart]
│ ├──> [Chọn thanh toán]
│ │ ├──> [QR]
│ │ └──> [Tại quán]
│ └──> [Xác nhận đơn]
│
├──> [Ưu đãi]
├──> [Lịch sử đơn]
├──> [Tích điểm]
├──> [Giới thiệu]
└──> [Liên hệ / Bản đồ]

---

## 🧩 Chức năng chính
### 1. Trang chủ (`/`)
- Hero section: ảnh + slogan + CTA “Đặt ngay”
- Section: sản phẩm nổi bật, ưu đãi
- Footer: liên hệ + mạng xã hội

### 2. Menu (`/menu`)
- Filter: Cà phê | Trà | Bánh | Signature  
- Card sản phẩm (ảnh, giá, nút “+”)
- Modal chi tiết món → chọn size, topping, đá, đường  
- Nút: “Thêm vào giỏ hàng”

### 3. Giỏ hàng (`/cart`)
- Liệt kê món + tổng tiền  
- Chọn phương thức thanh toán:  
  - QR động (Momo / Ngân hàng)
  - Thanh toán tại quán  
- Xác nhận đơn + hiển thị “Đặt hàng thành công ✅”

### 4. Lịch sử đơn hàng (`/orders`)
- Danh sách đơn: trạng thái `pending/making/done`  
- Nút “Đặt lại món này”

### 5. Tích điểm (`/profile`)
- Hiển thị cấp độ: Bronze / Silver / Gold  
- Điểm thưởng + tiến trình nâng hạng  
- CTA “Xem ưu đãi của bạn”

### 6. Ưu đãi (`/promo`)
- Card combo/giảm giá, ngày hiệu lực  
- Nút “Áp dụng ngay” → `/menu`

### 7. Giới thiệu (`/about`)
- Câu chuyện thương hiệu  
- Ảnh không gian quán, video  
- CTA “Thử ngay ALo Coffee ☕”

### 8. Liên hệ (`/contact`)
- Form: Họ tên – SĐT – Tin nhắn  
- Google Map: https://maps.app.goo.gl/uRev1n99u3g794Rv6  
- Nút “Gọi ngay” / “Chat Zalo”

---

## 👩‍💼 Admin Dashboard (`/admin`)
### 🔐 Auth
- Firebase Auth (role-based: admin / staff / user)

### 📦 Modules
1. **Orders:**  
   - Hiển thị đơn hàng realtime (pending → done)  
   - Cập nhật trạng thái đơn (Firebase snapshot)
2. **Products:**  
   - CRUD sản phẩm (ảnh Cloudinary)
3. **Promotions:**  
   - Tạo ưu đãi, thời gian áp dụng
4. **Users:**  
   - Danh sách khách hàng, điểm thưởng
5. **Analytics:**  
   - Recharts / Chart.js hiển thị doanh thu, top bán chạy

---

## 🔄 Tích hợp hệ thống
| Thành phần | Chức năng | Ghi chú |
|-------------|------------|---------|
| Firebase Auth | Đăng nhập user/admin | Email + password |
| Firestore | Lưu sản phẩm, đơn hàng, điểm thưởng | Realtime |
| Cloud Functions | Tự động cập nhật đơn, gửi thông báo | Trigger `status=paid` |
| Cloudinary | Upload ảnh sản phẩm/banner/logo | CDN |
| Vercel | Deploy web/app | HTTPS tự động |

---

## 📱 PWA Feature (optional)
- manifest.json (icon, màu theme)
- service-worker.ts (offline cache)
- Add to home screen (iOS/Android)
- Splash screen khi mở app

---

## 🧾 Nhiệm vụ chi tiết (TODO)

### Phase 1 – Base setup ✅ HOÀN THÀNH
- [x] Khởi tạo Next.js + TypeScript + Tailwind
- [x] Cài Framer Motion + Shadcn/UI
- [x] Setup cấu trúc thư mục `/components`, `/app`, `/lib`
- [x] Cấu hình theme (Tailwind config + colors cafe tone)
- [x] Thêm favicon/logo ALo Coffee

### Phase 2 – UI/UX pages ✅ HOÀN THÀNH
- [x] Trang chủ (Hero, CTA, sản phẩm nổi bật)
- [x] Trang Menu (filter, card, modal)
- [x] Trang Giỏ hàng (cart summary)
- [x] Trang Thanh toán QR (QR mockup)
- [x] Trang Ưu đãi / Lịch sử / Profile
- [x] Trang About / Contact

### Phase 3 – Backend integration ✅ HOÀN THÀNH
- [x] Kết nối Firebase Auth + Firestore
- [x] Tạo cấu trúc collection:
  - `/products`
  - `/orders`
  - `/users`
  - `/promotions`
  - `/loyalty` (NEW)
- [x] Tích hợp CRUD với Firestore
- [x] Upload ảnh → Cloudinary

### Phase 4 – Admin Dashboard ✅ HOÀN THÀNH
- [x] Layout sidebar + table view
- [x] CRUD sản phẩm
- [x] Danh sách đơn hàng realtime
- [x] Thống kê doanh thu (Chart.js / Recharts)
- [x] Role check (admin vs user)

### Phase 5 – PWA + Optimize ✅ HOÀN THÀNH
- [x] Thêm manifest.json
- [x] Service worker cache
- [x] Dark mode (Tailwind theme toggle)
- [x] Animation transition mượt (Framer Motion)
- [x] Responsive mobile-first
- [x] SEO (robots.txt + sitemap)
- [x] Back to top button
- [x] Hệ thống tích điểm (Bronze/Silver/Gold)

---

## 🧩 Optional Enhancements
- [ ] Đăng nhập Google
- [x] QR thanh toán (VietQR integration) ✅
- [ ] Push notification (Cloud Messaging)
- [ ] CMS nhẹ (Sanity / FireCMS)
- [ ] Đặt bàn (Booking form + table status)

---

## ✅ DỰ ÁN ĐÃ HOÀN THÀNH 100%
Xem chi tiết trong file **DO_COMPLETED.md**

---

## 🧠 Note cho AI Developer
- Ưu tiên clean code, component reuse (Card, Modal, Button, Input)
- Tạo mock data nếu chưa có Firestore
- Animation: subtle, không lòe loẹt
- Code cần có type rõ ràng (TypeScript strict)
- Tối ưu Lighthouse ≥ 90 (Performance + SEO)
- Viết code như production-ready project

---

## 🔗 Reference
- [The Coffee House](https://www.thecoffeehouse.com)
- [Arabica Coffee](https://arabica.coffee)
- [Highlands Coffee](https://www.highlandscoffee.com.vn)
- [Starbucks](https://www.starbucks.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)

---
