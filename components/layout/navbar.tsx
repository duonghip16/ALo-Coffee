"use client"

import { ShoppingCart, User, Coffee, BookOpen, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"

export function Navbar() {
  const { items } = useCart()
  const { user } = useAuth()
  const pathname = usePathname()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const navLinks = [
    { href: "/menu", label: "Menu", icon: Coffee },
    { href: "/about", label: "Giới thiệu", icon: BookOpen },
    { href: "/contact", label: "Liên hệ", icon: Phone },
  ]

  return (
    <>
    <nav className="sticky top-0 z-50 bg-[#6B4423] dark:bg-[#3A2416] backdrop-blur-sm border-b border-[#5A3A1F] dark:border-[#2A1A12] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/favicon.png" alt="ALo Coffee" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-xl font-bold text-[#FEF7ED]">ALo Coffee</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#5A3A1F] dark:bg-[#2A1A12] text-[#FEF7ED]"
                        : "text-[#FEF7ED]/80 hover:text-[#FEF7ED] hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{link.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#FEF7ED] hover:text-[#FEF7ED]/80 hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11"
              asChild
            >
              <Link href="/checkout">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 bg-red-500 text-[10px] sm:text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#FEF7ED] hover:text-[#FEF7ED]/80 hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11"
              asChild
            >
              <Link href={user ? "/profile" : "/auth"}>
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navigation */}
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#6B4423] dark:bg-[#3A2416] border-t border-[#5A3A1F] dark:border-[#2A1A12] shadow-lg"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "text-[#FEF7ED]" 
                    : "text-[#FEF7ED]/60 hover:text-[#FEF7ED]/80"
                }`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="text-[10px] font-medium">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FEF7ED] rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>


    </>
  )
}
