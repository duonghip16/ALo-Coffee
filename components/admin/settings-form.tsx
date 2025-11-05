"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSettings, updateSettings } from "@/lib/firestore-service"
import type { Settings } from "@/lib/firestore-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings()
        setSettings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải cài đặt")
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleChange = (field: keyof Settings, value: any) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : null))
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      if (!settings) throw new Error("Dữ liệu cài đặt không tồn tại")
      await updateSettings(settings)
      setSuccess("Cài đặt đã được lưu thành công")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu cài đặt")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coffee-700 mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">Đang tải cài đặt...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return <p className="text-destructive">Không thể tải cài đặt</p>
  }

  return (
    <Card className="p-4 lg:p-6 bg-white dark:bg-[#6B4423] border-[#E4D9C9] dark:border-[#7B5433]">
      <h3 className="text-base lg:text-lg font-semibold text-[#2A1A12] dark:text-white mb-4">Cài đặt cửa hàng</h3>

      <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
        <div>
          <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Tên cửa hàng</label>
          <Input
            type="text"
            value={settings.shopName}
            onChange={(e) => handleChange("shopName", e.target.value)}
            placeholder="ALo Coffee"
            className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Số điện thoại</label>
          <Input
            type="tel"
            value={settings.shopPhone}
            onChange={(e) => handleChange("shopPhone", e.target.value)}
            placeholder="0932653465"
            className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Địa chỉ</label>
          <Textarea
            value={settings.shopAddress}
            onChange={(e) => handleChange("shopAddress", e.target.value)}
            placeholder="149/10 Bùi Văn Ngữ, Phường Hiệp Thành, Quận 12"
            className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Giới thiệu cửa hàng</label>
          <Textarea
            value={settings.shopDescription}
            onChange={(e) => handleChange("shopDescription", e.target.value)}
            placeholder="ALo Coffee – nơi bạn dừng chân giữa Sài Gòn nhộn nhịp..."
            rows={4}
            className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Email</label>
          <Input
            type="email"
            value={settings.shopEmail || ""}
            onChange={(e) => handleChange("shopEmail", e.target.value)}
            placeholder="hello@alo-coffee.com"
            className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Link Google Maps</label>
          <Input
            type="url"
            value={settings.shopMapUrl || ""}
            onChange={(e) => handleChange("shopMapUrl", e.target.value)}
            placeholder="https://maps.app.goo.gl/d7GZ3HGgcUtAqnNX6"
            className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Số tài khoản</label>
            <Input
              type="text"
              value={settings.bankAccount || ""}
              onChange={(e) => handleChange("bankAccount", e.target.value)}
              placeholder="1234567890"
              className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8] mb-1">Mã ngân hàng</label>
            <Input
              type="text"
              value={settings.bankCode || ""}
              onChange={(e) => handleChange("bankCode", e.target.value)}
              placeholder="VCB"
              className="bg-white dark:bg-[#3A2416] text-[#2A1A12] dark:text-white border-[#E4D9C9] dark:border-[#7B5433] text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[#FEF7ED] dark:bg-[#3A2416] rounded-lg border border-[#E4D9C9] dark:border-[#7B5433]">
          <input
            type="checkbox"
            id="isOpen"
            checked={settings.isOpen}
            onChange={(e) => handleChange("isOpen", e.target.checked)}
            className="w-4 h-4 rounded border-[#E4D9C9] dark:border-[#7B5433] text-[#C47B3E] focus:ring-[#C47B3E]"
          />
          <label htmlFor="isOpen" className="text-sm font-medium text-[#2A1A12] dark:text-[#E8DCC8]">
            Cửa hàng đang mở cửa
          </label>
        </div>

        {error && (
          <Card className="p-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-xs lg:text-sm text-red-800 dark:text-red-200">{error}</p>
          </Card>
        )}

        {success && (
          <Card className="p-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <p className="text-xs lg:text-sm text-green-800 dark:text-green-200">{success}</p>
          </Card>
        )}

        <Button 
          type="submit" 
          disabled={saving} 
          className="w-full bg-gradient-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#8E5522] hover:to-[#C47B3E] text-white font-bold shadow-lg h-10 lg:h-11 text-sm lg:text-base"
        >
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </form>
    </Card>
  )
}
