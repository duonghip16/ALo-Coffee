import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { PageTransition } from "@/components/ui/page-transition"
import "./globals.css"

export const metadata: Metadata = {
  title: "ALo Coffee",
  description: "Nơi dừng chân giữa Sài Gòn nhộn nhịp – ALo Coffee mang đến hương vị và không gian đậm chất chill.",
  keywords: ["cafe", "coffee", "đặt món", "online", "VietQR", "Sài Gòn", "quán cafe"],
  authors: [{ name: "ALo Coffee Team" }],
  creator: "ALo Coffee",
  publisher: "ALo Coffee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alo-coffee.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ALo Coffee - Đặt món cafe hiện đại",
    description: "Nơi bạn tìm lại thanh thản giữa Sài Gòn nhộn nhịp",
    url: "https://alo-coffee.vercel.app",
    siteName: "ALo Coffee",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ALo Coffee - Đặt món cafe hiện đại",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALo Coffee - Đặt món cafe hiện đại",
    description: "Nơi bạn tìm lại thanh thản giữa Sài Gòn nhộn nhịp",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ALo Coffee",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6b4226",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <PageTransition>
            {children}
          </PageTransition>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
