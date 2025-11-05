"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { UserListAdmin } from "@/components/admin/user-list-admin"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserForm } from "@/components/admin/user-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useUsers } from "@/hooks/use-users"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { users, loading } = useUsers()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải người dùng...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF6F0] dark:bg-[#EDE3D4]">
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-3 lg:px-6 py-4 lg:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 lg:mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-lg lg:text-3xl font-extrabold text-[#2A1A12] dark:text-[#4e3521] mb-1 lg:mb-2 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Quản lý người dùng
                </h2>
                <p className="text-xs lg:text-sm font-semibold text-[#2A1A12] dark:text-[#4e3521]">
                  Quản lý tài khoản và phân quyền
                </p>
              </div>
              <Button
                onClick={handleAdd}
                className="w-full lg:w-auto bg-gradient-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#8E5522] hover:to-[#C47B3E] text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm người dùng
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <UserListAdmin users={users} onEdit={handleEdit} />
            </motion.div>
          </div>
        </main>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
          <UserForm user={editingUser} onSuccess={handleClose} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
