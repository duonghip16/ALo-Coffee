"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit, Lock, Unlock, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { toast } from "sonner"
import type { User } from "@/hooks/use-users"
import { getVietnamTimestamp, formatVietnamDate } from "@/lib/date-utils"

interface UserListAdminProps {
  users: User[]
  onEdit: (user: User) => void
}

export function UserListAdmin({ users, onEdit }: UserListAdminProps) {
  const [search, setSearch] = useState("")
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [lockUser, setLockUser] = useState<User | null>(null)

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.uid.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    try {
      await updateDoc(doc(db, "users", user.uid), {
        status: newStatus,
        updatedAt: getVietnamTimestamp()
      })
      toast.success(newStatus === "inactive" ? `⚪ Đã chuyển sang Inactive: ${user.name}` : `🟢 Đã kích hoạt tài khoản ${user.name}`)
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái")
    }
  }

  const handleDelete = async () => {
    if (!deleteUser) return
    try {
      await updateDoc(doc(db, "users", deleteUser.uid), {
        isArchived: true,
        updatedAt: getVietnamTimestamp()
      })
      toast.success(`🗑️ Đã xóa người dùng ${deleteUser.name}`)
      setDeleteUser(null)
    } catch (error) {
      toast.error("Lỗi khi xóa người dùng")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#6B4423] rounded-lg border border-[#7B5433] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#3A2416] text-white">
              <tr>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-[10px] lg:text-sm font-semibold">Avatar</th>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-[10px] lg:text-sm font-semibold">Tên</th>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-[10px] lg:text-sm font-semibold hidden lg:table-cell">SĐT</th>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-[10px] lg:text-sm font-semibold hidden sm:table-cell">Vai trò</th>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-[10px] lg:text-sm font-semibold">Trạng thái</th>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-[10px] lg:text-sm font-semibold hidden md:table-cell">Ngày tạo</th>
                <th className="px-2 lg:px-4 py-2 lg:py-3 text-right text-[10px] lg:text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-[#E8DCC8] dark:border-[#7B5433] hover:bg-[#FEF7ED] dark:hover:bg-[#7B5433] transition-colors"
                  >
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-[#C47B3E] text-white text-xs lg:text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 font-medium text-xs lg:text-sm text-[#2A1A12] dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-[#2A1A12] dark:text-[#E8DCC8] hidden lg:table-cell">
                      {user.phone || "—"}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 hidden sm:table-cell">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px] lg:text-xs">
                        {user.role === "admin" ? "Admin" : "Khách"}
                      </Badge>
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="cursor-pointer"
                      >
                        <Badge
                          variant={user.status === "active" ? "default" : "destructive"}
                          className="text-[9px] lg:text-xs cursor-pointer hover:opacity-80"
                        >
                          {user.status === "active" ? "🟢" : user.status === "inactive" ? "⚪" : "🔴"}
                          <span className="hidden sm:inline ml-1">{user.status === "active" ? "Active" : user.status === "inactive" ? "Inactive" : "Locked"}</span>
                        </Badge>
                      </button>
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-[10px] lg:text-sm text-[#2A1A12] dark:text-[#E8DCC8] hidden md:table-cell">
                      {typeof user.createdAt === 'number' ? formatVietnamDate(user.createdAt) : user.createdAt?.toDate ? formatVietnamDate(user.createdAt.toDate().getTime()) : 'N/A'}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <div className="flex items-center justify-end gap-1 lg:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(user)}
                          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-[#C47B3E] hover:text-white"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLockUser(user)}
                          className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-[#C47B3E] hover:text-white hidden sm:flex"
                          title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa"}
                        >
                          {user.status === "active" ? <Lock className="h-3 w-3 lg:h-4 lg:w-4" /> : <Unlock className="h-3 w-3 lg:h-4 lg:w-4" />}
                        </Button>
                        {user.role !== "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteUser(user)}
                            className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-red-500 hover:text-white"
                            title="Xóa người dùng"
                          >
                            <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Không tìm thấy người dùng
          </div>
        )}
      </div>

      <AlertDialog open={!!lockUser} onOpenChange={() => setLockUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lockUser?.status === "active" ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lockUser?.status === "active"
                ? `Chuyển tài khoản ${lockUser?.name} sang trạng thái Inactive? Họ sẽ không thể thêm vào giỏ hàng và đặt hàng.`
                : `Kích hoạt tài khoản ${lockUser?.name}? Họ sẽ có thể thêm vào giỏ hàng và đặt hàng.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (lockUser) handleToggleStatus(lockUser)
                setLockUser(null)
              }}
              className="bg-[#C47B3E] hover:bg-[#8E5522]"
            >
              {lockUser?.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa người dùng {deleteUser?.name} không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
