"use client"

import { ShoppingCart, User, Coffee, BookOpen, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/context/auth-context"
import { UserAvatar } from "@/components/admin/user-avatar"
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

            {user ? (
              <Link href="/profile">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <UserAvatar
                    name={user.name}
                    email={user.email}
                    photoURL={user.photoURL}
                    size="sm"
                  />
                </motion.div>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-[#FEF7ED] hover:text-[#FEF7ED]/80 hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11"
                asChild
              >
                <Link href="/auth">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Navigation - Below Header */}
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden sticky top-14 z-40 bg-[#5A3A1F] dark:bg-[#2A1A12] border-b border-[#4A2A0F] dark:border-[#1A0A02]"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-[#6B4423] dark:bg-[#3A2416] text-[#FEF7ED]" 
                    : "text-[#FEF7ED]/70 hover:text-[#FEF7ED]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{link.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
    </>
  )
}
