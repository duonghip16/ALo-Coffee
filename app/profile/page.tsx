"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { UserAvatar } from "@/components/admin/user-avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChangePasswordDialog } from "@/components/profile/change-password-dialog"
import { LogOut, Phone, Calendar, ShoppingBag, ArrowLeft, User, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { formatVietnamDate } from "@/lib/date-utils"

export default function ProfilePage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#1A0F08]">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-[#6B4423] to-[#8E5522] dark:from-[#3A2416] dark:to-[#2A1A12] sticky top-0 z-30 shadow-lg"
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white dark:text-[#FEF7ED] flex items-center gap-2">
                <User className="w-6 h-6" />
                Hồ sơ cá nhân
              </h1>
              <p className="text-white/90 dark:text-[#E8DCC8] text-sm mt-1">Quản lý thông tin tài khoản</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white dark:bg-[#3A2416] border-[#E8DCC8] dark:border-[#5A3A1F] overflow-hidden shadow-lg">
            {/* Avatar Section */}
            <div className="bg-gradient-to-br from-[#C47B3E] to-[#8E5522] dark:from-[#6B4423] dark:to-[#5A3A1F] p-8 text-center relative">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <UserAvatar
                  name={user.name}
                  email={user.email}
                  photoURL={user.photoURL}
                  size="xl"
                  className="mx-auto mb-4 ring-4 ring-white/20"
                />
                <h1 className="text-2xl font-bold text-white dark:text-[#FEF7ED] mb-2">{user.name}</h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white/90 dark:text-[#FEF7ED] text-sm font-medium">
                    {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="p-6 space-y-3">
              {user.phone && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#FEF7ED] dark:bg-[#5A3A1F] border border-[#E8DCC8] dark:border-[#6B4423]"
                >
                  <div className="p-2 rounded-lg bg-[#C47B3E]/10 dark:bg-[#C47B3E]/20">
                    <Phone className="w-5 h-5 text-[#C47B3E] dark:text-[#E8A05D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#6B4423]/60 dark:text-[#E8DCC8]/70 font-medium">Số điện thoại</p>
                    <p className="font-semibold text-[#2A1A12] dark:text-[#FEF7ED]">{user.phone}</p>
                  </div>
                </motion.div>
              )}

              {user.createdAt && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#FEF7ED] dark:bg-[#5A3A1F] border border-[#E8DCC8] dark:border-[#6B4423]"
                >
                  <div className="p-2 rounded-lg bg-[#C47B3E]/10 dark:bg-[#C47B3E]/20">
                    <Calendar className="w-5 h-5 text-[#C47B3E] dark:text-[#E8A05D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#6B4423]/60 dark:text-[#E8DCC8]/70 font-medium">Ngày tham gia</p>
                    <p className="font-semibold text-[#2A1A12] dark:text-[#FEF7ED]">
                      {typeof user.createdAt === 'number' 
                        ? formatVietnamDate(user.createdAt)
                        : user.createdAt?.toDate 
                          ? formatVietnamDate(user.createdAt.toDate().getTime())
                          : 'N/A'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => router.push("/order-tracking")}
                  className="w-full bg-gradient-to-r from-[#6B4423] to-[#8E5522] hover:from-[#8E5522] hover:to-[#6B4423] dark:from-[#C47B3E] dark:to-[#8E5522] text-white shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Lịch sử đơn hàng
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <ChangePasswordDialog />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 bg-white dark:bg-[#5A3A1F]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
