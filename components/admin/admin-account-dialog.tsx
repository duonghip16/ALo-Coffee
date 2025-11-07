"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAvatar } from "./user-avatar"
import { Mail, Shield, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { updatePassword } from "firebase/auth"
import { auth } from "@/lib/firebase-client"

interface AdminAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminAccountDialog({ open, onOpenChange }: AdminAccountDialogProps) {
  const { user } = useAuth()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    setLoading(true)
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await updatePassword(currentUser, newPassword)
        toast.success("Đã đổi mật khẩu thành công")
        setNewPassword("")
        setConfirmPassword("")
        onOpenChange(false)
      }
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        toast.error("Vui lòng đăng xuất và đăng nhập lại để đổi mật khẩu")
      } else {
        toast.error("Có lỗi xảy ra khi đổi mật khẩu")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tài khoản Admin</DialogTitle>
          <DialogDescription>Quản lý thông tin tài khoản của bạn</DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-linear-to-r from-[#C47B3E] to-[#8E5522] rounded-xl text-white">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <UserAvatar name={user?.name} email={user?.email} photoURL={user?.photoURL} size="lg" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm opacity-90">Xin chào</p>
                <p className="text-lg font-bold">{user?.name || "Admin"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F5EFE7] dark:bg-[#3A2C20] rounded-lg">
                <Mail className="w-5 h-5 text-[#6B4423]" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F5EFE7] dark:bg-[#3A2C20] rounded-lg">
                <Shield className="w-5 h-5 text-[#6B4423]" />
                <div>
                  <p className="text-xs text-muted-foreground">Vai trò</p>
                  <p className="font-semibold text-sm capitalize">{user?.role || "Admin"}</p>
                </div>
              </div>

              {user?.createdAt && (
                <div className="flex items-center gap-3 p-3 bg-[#F5EFE7] dark:bg-[#3A2C20] rounded-lg">
                  <Calendar className="w-5 h-5 text-[#6B4423]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày tạo</p>
                    <p className="font-semibold text-sm">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-bold text-lg">Đổi mật khẩu</h3>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-linear-to-r from-[#6B4423] to-[#8B6F47]"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
