<div align="center">

# ☕ ALo Coffee

### *Ứng dụng web & PWA quản lý quán cà phê hiện đại*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.5.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🌐 Live Demo](https://alo-coffee.vercel.app) • [📖 Documentation](#-cài-đặt--chạy-thử) • [🐛 Report Bug](https://github.com/duonghip16/alo-coffee/issues) • [✨ Request Feature](https://github.com/duonghip16/alo-coffee/issues)

![ALo Coffee Banner](public/logo.png)

</div>

---

## 📋 Mục lục

- [📝 Giới thiệu](#-giới-thiệu)
- [💻 Demo](#-demo)
- [⚙️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [🌟 Tính năng nổi bật](#-tính-năng-nổi-bật)
- [🔧 Cài đặt & Chạy thử](#-cài-đặt--chạy-thử)
- [🧠 Scripts](#-scripts)
- [📸 Ảnh minh họa](#-ảnh-minh-họa)
- [🤝 Đóng góp](#-đóng-góp)
- [📬 Liên hệ](#-liên-hệ)
- [📄 License](#-license)

---

## 📝 Giới thiệu

**ALo Coffee** là ứng dụng web và PWA toàn diện giúp quản lý quán cà phê hiện đại:
- 🛒 **Khách hàng**: Xem menu, đặt món, thanh toán VietQR, theo dõi đơn hàng realtime
- 👨💼 **Quản trị viên**: Quản lý menu, đơn hàng, thống kê doanh thu, quản lý users
- 📱 **PWA**: Cài đặt như app native, hoạt động offline, trải nghiệm mượt mà

> *"Nơi bạn dừng chân giữa Sài Gòn nhộn nhịp để tìm lại một khoảnh khắc thanh thản."*

---

## 💻 Demo

🌐 **Live Demo**: [https://alo-coffee.vercel.app](https://alo-coffee.vercel.app)

### 🔐 Tài khoản demo

**Khách hàng:**
- SĐT: `0123456789`
- Mật khẩu: `123456`

**Admin:**
- Truy cập: `/admin`
- Tự tạo tài khoản và đổi role trong Firestore

---

## ⚙️ Công nghệ sử dụng

<div align="center">

| Frontend | Backend & Data | Tools & Integrations |
|:--------:|:--------------:|:--------------------:|
| ![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js) | ![Firebase](https://img.shields.io/badge/Firebase-12.5.0-orange?logo=firebase) | ![Cloudinary](https://img.shields.io/badge/Cloudinary-Image-blue?logo=cloudinary) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript) | ![Firestore](https://img.shields.io/badge/Firestore-Database-orange?logo=firebase) | ![VietQR](https://img.shields.io/badge/VietQR-Payment-green) |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?logo=tailwind-css) | ![Auth](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase) | ![PWA](https://img.shields.io/badge/PWA-Enabled-purple?logo=pwa) |
| ![Framer Motion](https://img.shields.io/badge/Framer-Motion-purple?logo=framer) | ![Storage](https://img.shields.io/badge/Firebase-Storage-orange?logo=firebase) | ![Vercel](https://img.shields.io/badge/Vercel-Analytics-black?logo=vercel) |
| ![Zustand](https://img.shields.io/badge/Zustand-State-brown) | | |
| ![shadcn/ui](https://img.shields.io/badge/shadcn-UI-black) | | |

</div>

### 🎯 Highlights

- ⚡ **Next.js 15** với App Router và Server Components
- 🎨 **TailwindCSS v4** + **shadcn/ui** cho UI components
- 🔥 **Firebase** cho authentication, database, và storage
- 📱 **PWA** với next-pwa - cài đặt như app native
- 🌓 **Dark Mode** với next-themes
- 🎭 **Framer Motion** cho animations mượt mà
- 📊 **Real-time updates** với Firestore listeners

---

## 🌟 Tính năng nổi bật

### 👤 Dành cho Khách hàng

✅ **Menu động & Tìm kiếm**
- Xem menu theo danh mục (Cà phê, Trà, Smoothie...)
- Tìm kiếm sản phẩm nhanh chóng
- Lọc theo giá, độ phổ biến

✅ **Đặt món & Giỏ hàng**
- Thêm sản phẩm vào giỏ với variants và modifiers
- Floating cart button với số lượng realtime
- Tính tổng tiền tự động

✅ **Thanh toán VietQR**
- Tạo mã QR động với refCode duy nhất
- Hỗ trợ thanh toán tiền mặt
- Theo dõi trạng thái thanh toán

✅ **Theo dõi đơn hàng**
- Timeline 5 bước: Pending → Confirmed → Preparing → Ready → Completed
- Cập nhật realtime qua Firestore
- Lịch sử đơn hàng

✅ **Trải nghiệm PWA**
- Cài đặt như app native (Android, iOS, Desktop)
- Hoạt động offline với service worker
- Push notifications (coming soon)

### 👨💼 Dành cho Admin

✅ **Dashboard tổng quan**
- Thống kê doanh thu theo ngày/tháng
- Biểu đồ đơn hàng và sản phẩm bán chạy
- KPI cards: Tổng đơn, Doanh thu, Khách hàng

✅ **Quản lý đơn hàng**
- Xem danh sách đơn realtime
- Cập nhật trạng thái đơn
- Chi tiết từng món trong đơn
- Xác nhận thanh toán

✅ **Quản lý Menu**
- Thêm/sửa/xóa sản phẩm
- Upload ảnh qua Cloudinary
- Quản lý variants (Size) và modifiers (Topping)
- Bật/tắt sản phẩm

✅ **Quản lý Users**
- Xem danh sách khách hàng
- Quản lý trạng thái tài khoản (Active/Inactive/Locked)
- Phân quyền Admin/Customer

✅ **Cài đặt**
- Thông tin quán (Tên, SĐT, Địa chỉ)
- Giờ mở cửa
- Cấu hình VietQR
- Theme settings

### 🎨 UI/UX Features

- 🌓 **Dark Mode** - Chuyển đổi sáng/tối mượt mà
- 📱 **Responsive** - Tối ưu cho mobile, tablet, desktop
- 🎭 **Animations** - Micro-interactions với Framer Motion
- ♿ **Accessibility** - WCAG 2.1 compliant
- 🚀 **Performance** - Lighthouse score 90+

---

## 🔧 Cài đặt & Chạy thử

### 📋 Yêu cầu hệ thống

- Node.js 18.x trở lên
- npm/yarn/pnpm
- Firebase project (free tier)
- Cloudinary account (optional)

### 🚀 Bước 1: Clone repository

```bash
git clone https://github.com/duonghip16/alo-coffee.git
cd alo-coffee
```

### 📦 Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 🔥 Bước 3: Cấu hình Firebase

1. Tạo Firebase project tại [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Enable **Storage**
5. Copy Firebase config

### 🔐 Bước 4: Tạo file `.env.local`

Copy từ `.env.example` và điền thông tin:

```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:

```env
# Firebase Configuration (Bắt buộc)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# VietQR Configuration (Tùy chọn)
NEXT_PUBLIC_VIETQR_BANK_CODE=VCB
NEXT_PUBLIC_VIETQR_ACCOUNT_NUMBER=1234567890
NEXT_PUBLIC_VIETQR_ACCOUNT_NAME=ALO COFFEE

# Cloudinary Configuration (Tùy chọn)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 🌱 Bước 5: Seed dữ liệu mẫu (Optional)

```bash
npm run seed:categories
npm run sync:users
```

### 🎉 Bước 6: Chạy development server

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3001**

### 🏗️ Build cho production

```bash
npm run build
npm start
```

---

## 🧠 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Chạy development server (port 3001) |
| `npm run build` | Build production |
| `npm start` | Chạy production server |
| `npm run lint` | Lint code với ESLint |
| `npm run seed:categories` | Seed categories vào Firestore |
| `npm run sync:users` | Sync users (remove points field) |

---

## 📸 Ảnh minh họa

<div align="center">

### 🏠 Trang chủ
![Home Page](public/placeholder.jpg)

### 📱 Menu & Đặt món
![Menu Page](public/placeholder.jpg)

### 👨💼 Admin Dashboard
![Admin Dashboard](public/placeholder.jpg)

### 🌓 Dark Mode
![Dark Mode](public/placeholder.jpg)

</div>

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! 🎉

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

---

## 📬 Liên hệ

<div align="center">

### 👨💻 Tác giả

**Phạm Quang Dương**

[![GitHub](https://img.shields.io/badge/GitHub-duonghip16-black?style=for-the-badge&logo=github)](https://github.com/duonghip16)
[![Email](https://img.shields.io/badge/Email-duonghip16@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:duonghip16@gmail.com)

### 🌐 Project Links

[![Demo](https://img.shields.io/badge/Live_Demo-alo--coffee.vercel.app-blue?style=for-the-badge&logo=vercel)](https://alo-coffee.vercel.app)
[![Repository](https://img.shields.io/badge/Repository-GitHub-black?style=for-the-badge&logo=github)](https://github.com/duonghip16/alo-coffee)

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Nếu thấy project hữu ích, hãy cho một star nhé! ⭐

Made with ❤️ and ☕ in Saigon, Vietnam 🇻🇳

[![GitHub stars](https://img.shields.io/github/stars/duonghip16/alo-coffee?style=social)](https://github.com/duonghip16/alo-coffee/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/duonghip16/alo-coffee?style=social)](https://github.com/duonghip16/alo-coffee/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/duonghip16/alo-coffee?style=social)](https://github.com/duonghip16/alo-coffee/watchers)

</div>
