"use client"

import type React from "react"
import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { isConfigured, signUpWithPhone, signInWithPhone } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Vui lòng nhập tên")
          setLoading(false)
          return
        }
        await signUpWithPhone(name.trim(), phone.trim(), password)
      } else {
        await signInWithPhone(phone.trim(), password)
      }
      router.push("/menu")
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Số điện thoại đã được đăng ký")
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Số điện thoại hoặc mật khẩu không đúng")
      } else if (err.code === "auth/weak-password") {
        setError("Mật khẩu phải ít nhất 6 ký tự")
      } else {
        setError(err.message || "Đăng nhập thất bại")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7EFE5] dark:bg-[#6f5e48] px-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#8B6F47] rounded-2xl shadow-lg p-8 text-center border border-[#E8DCC8] dark:border-[#6B4423]">
          <h1 className="text-3xl font-bold text-[#3A2416] dark:text-[#FEF7ED] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>ALo Coffee</h1>
          <p className="text-destructive font-medium mb-2">Firebase Configuration Required</p>
          <p className="text-sm text-[#3A2416]/70 dark:text-[#FEF7ED]/80">
            Please add Firebase environment variables in the Vars section to use this app.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7EFE5] dark:bg-[#6f5e48] px-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#8B6F47] rounded-2xl shadow-lg p-8 border border-[#E8DCC8] dark:border-[#6B4423]">
        <h1 className="text-3xl font-bold text-[#3A2416] dark:text-[#FEF7ED] mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>ALo Coffee</h1>
        <p className="text-sm text-[#3A2416]/70 dark:text-[#FEF7ED]/80 text-center mb-6">Nơi bạn tìm lại thanh thản</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-[#3A2416] dark:text-[#FEF7ED] mb-2">Họ và tên</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#3A2416] dark:text-[#FEF7ED] mb-2">Số điện thoại</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3A2416] dark:text-[#FEF7ED] mb-2">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
              required
              minLength={6}
            />
          </div>

          {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full bg-[#6B4423] hover:bg-[#3A2416] text-[#FEF7ED]">
            {loading ? "Đang xử lý..." : isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-4 text-sm text-[#6B4423] hover:text-[#3A2416] font-medium"
        >
          {isSignUp ? "Đã có tài khoản? Đăng nhập" : "Tạo tài khoản mới"}
        </button>
      </div>
    </div>
  )
}
