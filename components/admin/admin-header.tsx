"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationToggle } from "./notification-toggle"
import { motion } from "framer-motion"
import { LogOut, User } from "lucide-react"

export function AdminHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#A97B50] dark:bg-[#3A2416] text-white sticky top-0 z-30 shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
    >
      <div className="max-w-7xl mx-auto px-3 lg:px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Title - Responsive */}
          <div className="min-w-0">
            <h1 className="text-lg lg:text-2xl font-bold tracking-wide truncate" style={{ fontFamily: 'Playfair Display, serif' }}>ALo Coffee Admin</h1>
            <p className="text-xs lg:text-sm text-white/80 hidden sm:block">Quản lý đơn hàng & cửa hàng</p>
          </div>

          {/* Actions - Responsive */}
          <div className="flex items-center gap-2 lg:gap-4">
            <NotificationToggle />

            {/* User info - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
              >
                <User className="h-4 w-4 text-white" />
              </motion.div>
              <span className="text-sm text-white/90 max-w-[150px] truncate">{user?.email}</span>
            </div>

            {/* Logout button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="icon"
                className="lg:size-auto lg:px-4 border-white/30 text-white hover:bg-white/10 bg-transparent transition-all duration-300"
              >
                <LogOut className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Đăng xuất</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
