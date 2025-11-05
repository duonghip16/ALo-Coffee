# 📁 ALo Coffee - Project Structure

## 🏗️ Cấu trúc thư mục

```
ALo-Coffee/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── auth/
│   │       └── page.tsx         # Đăng nhập
│   ├── about/
│   │   └── page.tsx             # Giới thiệu
│   ├── admin/
│   │   ├── menu/
│   │   │   └── page.tsx         # Quản lý menu
│   │   ├── orders/
│   │   │   └── page.tsx         # Quản lý đơn hàng
│   │   ├── settings/
│   │   │   └── page.tsx         # Cài đặt
│   │   └── page.tsx             # Admin dashboard
│   ├── checkout/
│   │   └── page.tsx             # Giỏ hàng & thanh toán
│   ├── contact/
│   │   └── page.tsx             # Liên hệ
│   ├── favorites/
│   │   └── page.tsx             # Yêu thích
│   ├── menu/
│   │   └── page.tsx             # Menu sản phẩm
│   ├── order-confirmation/
│   │   └── [orderId]/
│   │       └── page.tsx         # Xác nhận đơn
│   ├── order-tracking/
│   │   └── [orderId]/
│   │       └── page.tsx         # Theo dõi đơn
│   ├── profile/
│   │   └── page.tsx             # Tài khoản
│   ├── promo/
│   │   └── page.tsx             # Ưu đãi
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── manifest.json            # PWA manifest
│   ├── page.tsx                 # Trang chủ
│   ├── robots.txt               # SEO robots
│   └── sitemap.ts               # SEO sitemap
│
├── components/                   # React Components
│   ├── admin/                   # Admin components
│   │   ├── admin-header.tsx
│   │   ├── admin-sidebar.tsx
│   │   ├── analytics-dashboard.tsx
│   │   ├── menu-form.tsx
│   │   ├── notification-toggle.tsx
│   │   ├── order-list-admin.tsx
│   │   ├── order-stats-card.tsx
│   │   ├── product-list-admin.tsx
│   │   └── settings-form.tsx
│   ├── auth/
│   │   └── login-form.tsx       # Form đăng nhập
│   ├── checkout/
│   │   ├── cart-item.tsx        # Item trong giỏ hàng
│   │   ├── checkout-form.tsx
│   │   ├── order-summary.tsx
│   │   ├── payment-method-selector.tsx
│   │   ├── qr-modal.tsx         # Modal QR thanh toán
│   │   └── vietqr-payment.tsx
│   ├── home/
│   │   ├── featured-products.tsx # Sản phẩm nổi bật
│   │   ├── footer.tsx           # Footer
│   │   └── hero-section.tsx     # Hero section
│   ├── layout/
│   │   ├── main-layout.tsx      # Layout chính
│   │   └── navbar.tsx           # Navigation bar
│   ├── menu/
│   │   ├── cart-sidebar.tsx
│   │   ├── menu-card.tsx        # Card sản phẩm
│   │   ├── menu-page.tsx
│   │   ├── product-card.tsx
│   │   └── product-detail-modal.tsx # Modal chi tiết
│   ├── notifications/
│   │   └── notification-center.tsx
│   ├── pwa/
│   │   └── install-prompt.tsx   # PWA install prompt
│   ├── tracking/
│   │   ├── order-card.tsx
│   │   ├── order-detail-view.tsx
│   │   ├── order-status-badge.tsx
│   │   └── order-timeline.tsx
│   ├── ui/                      # Shadcn/UI components (60+)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── back-to-top.tsx      # Back to top button
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dark-mode-toggle.tsx # Dark mode toggle
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   └── ... (50+ more)
│   ├── providers.tsx            # App providers
│   └── theme-provider.tsx
│
├── context/
│   └── auth-context.tsx         # Auth context
│
├── hooks/                       # Custom hooks
│   ├── use-admin-notifications.ts
│   ├── use-admin-orders.ts
│   ├── use-cart.ts              # Cart hook
│   ├── use-favorites.ts
│   ├── use-loyalty.ts           # Loyalty points hook
│   ├── use-mobile.ts
│   ├── use-order-detail.ts
│   ├── use-order-notifications.ts
│   ├── use-orders.ts
│   └── use-toast.ts
│
├── lib/                         # Utilities & Services
│   ├── cloudinary-service.ts    # Cloudinary integration
│   ├── demo-data.ts             # Demo data (5 products)
│   ├── firebase-admin-server.ts
│   ├── firebase-admin.ts
│   ├── firebase-client.ts       # Firebase client
│   ├── firestore-service.ts     # Firestore CRUD
│   ├── loyalty-service.ts       # Loyalty points service
│   ├── notification-service.ts
│   ├── order-service.ts         # Order management
│   ├── product-service.ts       # Product CRUD
│   ├── pwa-service.ts           # PWA utilities
│   ├── utils.ts
│   └── vietqr-service.ts        # VietQR integration
│
├── public/                      # Static assets
│   ├── placeholder.jpg
│   ├── placeholder.svg
│   ├── placeholder-logo.png
│   ├── placeholder-user.jpg
│   └── sw.js                    # Service worker
│
├── styles/
│   └── globals.css
│
├── .env.local                   # Environment variables
├── components.json              # Shadcn config
├── DO.md                        # Project spec
├── DO_COMPLETED.md              # Completion report
├── FIRESTORE_SETUP.md
├── firestore.rules
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── STRUCTURE.md                 # This file
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Component Hierarchy

### Pages Flow
```
Home (/)
  └─ MainLayout
      ├─ Navbar
      ├─ HeroSection
      ├─ FeaturedProducts
      └─ Footer

Menu (/menu)
  └─ MainLayout
      ├─ Navbar
      ├─ Search + Filters
      ├─ MenuCard[] (demo data)
      │   └─ ProductDetailModal
      └─ Footer

Checkout (/checkout)
  └─ MainLayout
      ├─ Navbar
      ├─ CartItem[]
      ├─ Payment Selection
      ├─ QRModal (VietQR)
      └─ Footer

Admin (/admin)
  ├─ AdminHeader
  ├─ AdminSidebar
  └─ Dashboard Content
```

## 🔥 Firebase Collections

```
/products
  - id, name, slug, category, price, image
  - description, rating, available
  - sizes[], toppings[]

/orders
  - id, userId, code, items[]
  - subtotal, discount, total
  - payment: { method, status }
  - status, createdAt, updatedAt

/users
  - id, email, displayName
  - createdAt, role

/loyalty
  - userId, points, tier
  - totalSpent, ordersCount
  - createdAt, updatedAt

/promotions
  - id, title, description
  - discount, validUntil
  - active, image
```

## 🎨 Key Features Implemented

### ✅ Core Features
- [x] Hero Section với animation
- [x] Menu với 5 demo products
- [x] Product detail modal
- [x] Shopping cart (Zustand)
- [x] QR payment modal (VietQR)
- [x] Order tracking
- [x] Loyalty system (Bronze/Silver/Gold)
- [x] Admin dashboard
- [x] PWA support

### ✅ UI Components
- [x] Navbar với cart badge
- [x] Footer với links
- [x] MenuCard component
- [x] CartItem component
- [x] QRModal component
- [x] ProductDetailModal
- [x] Dark mode toggle
- [x] Back to top button

### ✅ Services
- [x] Firebase Auth
- [x] Firestore CRUD
- [x] VietQR integration
- [x] Cloudinary ready
- [x] Loyalty points
- [x] PWA service worker

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Demo Data

5 sản phẩm mẫu trong `lib/demo-data.ts`:
1. Cà phê sữa đá - 29,000đ
2. Bạc xỉu - 32,000đ
3. Trà sữa trân châu - 35,000đ
4. Cappuccino - 45,000đ
5. Bánh mì que - 15,000đ

## 🎯 Next Steps

1. Kết nối Firebase (cập nhật .env.local)
2. Seed demo data vào Firestore
3. Test checkout flow
4. Deploy lên Vercel
5. Cấu hình VietQR thật

---

**Status**: ✅ Scaffolding Complete - Ready for Development
