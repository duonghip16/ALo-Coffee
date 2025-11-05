"use client"

import { Coffee, MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getSettings, type Settings } from "@/lib/firestore-service"

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings()
      setSettings(data)
    }
    loadSettings()
  }, [])

  return (
    <footer className="bg-[#6B4423] dark:bg-[#3A2416] text-[#FEF7ED] py-6 sm:py-12 pb-20 md:pb-6">
      <div className="container mx-auto px-4">
        {/* Mobile Footer */}
        <div className="md:hidden space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <Coffee className="w-7 h-7" />
              <span className="text-xl font-bold">{settings?.shopName || "ALo Coffee"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <h3 className="font-bold text-sm mb-2">Liên kết</h3>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/menu" className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">Menu</Link></li>
                <li><Link href="/about" className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">Giới thiệu</Link></li>
                <li><Link href="/contact" className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">Liên hệ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-2">Liên hệ</h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a href={`tel:${settings?.shopPhone || "+84123456789"}`} className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">
                    {settings?.shopPhone || "+84 123 456 789"}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings?.shopEmail || "hello@alo-coffee.com"}`} className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors break-all">
                    {settings?.shopEmail || "hello@alo-coffee.com"}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-8 h-8" />
              <span className="text-2xl font-bold">{settings?.shopName || "ALo Coffee"}</span>
            </div>
            <p className="text-[#FEF7ED]/70 text-sm">
              {settings?.shopDescription || "Nơi bạn tìm lại thanh thản giữa Sài Gòn nhộn nhịp"}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">Menu</Link></li>
              <li><Link href="/about" className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">Giới thiệu</Link></li>
              <li><Link href="/contact" className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span className="text-[#FEF7ED]/70">{settings?.shopAddress || "Sài Gòn, Việt Nam"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href={`tel:${settings?.shopPhone || "+84123456789"}`} className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">
                  {settings?.shopPhone || "+84 123 456 789"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href={`mailto:${settings?.shopEmail || "hello@alo-coffee.com"}`} className="text-[#FEF7ED]/70 hover:text-[#FEF7ED] transition-colors">
                  {settings?.shopEmail || "hello@alo-coffee.com"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Theo dõi</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#FEF7ED]/10 hover:bg-[#FEF7ED]/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#FEF7ED]/10 hover:bg-[#FEF7ED]/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FEF7ED]/10 pt-4 sm:pt-8 text-center text-xs sm:text-sm text-[#FEF7ED]/60">
          <p>&copy; {new Date().getFullYear()} ALo Coffee. Made with ❤️ in Saigon 🇻🇳</p>
        </div>
      </div>
    </footer>
  )
}
