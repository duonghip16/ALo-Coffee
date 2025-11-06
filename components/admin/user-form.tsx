"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User as UserIcon, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { toast } from "sonner"
import type { User } from "@/hooks/use-users"
import { getVietnamTimestamp } from "@/lib/date-utils"

interface UserFormProps {
  user?: User | null
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [role, setRole] = useState<"admin" | "customer">(user?.role || "customer")
  const [status, setStatus] = useState<"active" | "locked">(user?.status || "active")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return avatarUrl

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', avatarFile)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      const result = await response.json()
      return result.secure_url
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên")
      return avatarUrl
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên người dùng")
      return
    }

    setLoading(true)
    try {
      const uploadedAvatar = await handleAvatarUpload()

      const userData = {
        name: name.trim(),
        phone: phone.trim(),
        role,
        status,
        avatarUrl: uploadedAvatar,
        updatedAt: getVietnamTimestamp()
      }

      if (user) {
        await updateDoc(doc(db, "users", user.uid), userData)
        toast.success(`📝 Cập nhật thành công cho ${name}`)
      } else {
        const newUid = `user_${Date.now()}`
        await setDoc(doc(db, "users", newUid), {
          ...userData,
          createdAt: getVietnamTimestamp(),
          isArchived: false
        })
        toast.success(`✅ Đã thêm người dùng ${name} thành công`)
      }

      onSuccess()
    } catch (error) {
      toast.error("Lỗi khi lưu người dùng")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <UserIcon className="h-5 w-5 text-coffee-700" />
        <h3 className="text-xl font-semibold text-coffee-900">
          {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-[#C47B3E] text-white text-2xl">
              {name.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-coffee-300 rounded-lg cursor-pointer hover:bg-coffee-50 transition-colors text-sm"
            >
              <Upload className="h-4 w-4 text-coffee-600" />
              <span className="text-coffee-700">Tải ảnh đại diện</span>
            </label>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAvatarUrl("")
                  setAvatarFile(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-coffee-900 mb-2 block">
            Tên người dùng <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-coffee-900 mb-2 block">
            Số điện thoại
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0932653465"
            pattern="0\d{9}"
            maxLength={10}
            title="Số điện thoại phải có 10 số và bắt đầu bằng số 0"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-coffee-900 mb-2 block">
            Vai trò
          </label>
          <Select value={role} onValueChange={(v) => setRole(v as "admin" | "customer")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Khách hàng</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-coffee-900 mb-2 block">
            Trạng thái
          </label>
          <Select value={status} onValueChange={(v) => setStatus(v as "active" | "locked")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">🟢 Active</SelectItem>
              <SelectItem value="locked">🔴 Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={loading || uploading || !name.trim()}
            className="flex-1 bg-gradient-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#8E5522] hover:to-[#C47B3E] text-white"
          >
            {loading ? "Đang lưu..." : user ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
