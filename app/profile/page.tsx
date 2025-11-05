"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, LogOut, Heart, Package, Award, TrendingUp } from "lucide-react"
import { getOrders } from "@/lib/firestore-service"
import type { Order } from "@/lib/firestore-service"
import { useLoyalty } from "@/hooks/use-loyalty"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const { loyalty, tierInfo } = useLoyalty()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const loadOrders = async () => {
        try {
          const userOrders = await getOrders(user.uid)
          setOrders(userOrders)
        } catch (error) {
          console.error("Error loading orders:", error)
        } finally {
          setOrdersLoading(false)
        }
      }
      loadOrders()
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  if (loading || ordersLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const completedOrders = orders.filter((o) => o.status === "completed").length

  return (
    <div className="min-h-screen bg-[#F7EFE5] dark:bg-[#F7EFE5] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#3A2416]" style={{ fontFamily: 'Playfair Display, serif' }}>Tài khoản của tôi</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#3A2416]">Thông tin cá nhân</h2>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8DCC8] flex items-center justify-center">
              <span className="text-xl font-bold text-[#6B4423]">{user?.email?.[0].toUpperCase()}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Tài khoản được tạo:{" "}
              {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("vi-VN") : "N/A"}
            </p>
          </div>
        </Card>

        {/* Loyalty Card */}
        {loyalty && (
          <Card className="p-6 bg-linear-to-br from-[#6B4423] to-[#3A2416] text-[#FEF7ED]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Hạng thành viên</p>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  <span className="text-2xl font-bold capitalize">
                    {loyalty.tier === "bronze" ? "Đồng" : loyalty.tier === "silver" ? "Bạc" : "Vàng"}
                  </span>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                {loyalty.points} điểm
              </Badge>
            </div>
            {tierInfo && tierInfo.nextTier && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/80">Tiến độ lên hạng {tierInfo.nextTier === "silver" ? "Bạc" : "Vàng"}</span>
                  <span className="text-white/80">{tierInfo.pointsNeeded} điểm nữa</span>
                </div>
                <Progress value={tierInfo.progress} className="h-2 bg-white/20" />
              </div>
            )}
            {tierInfo && !tierInfo.nextTier && (
              <p className="text-sm text-white/80">🎉 Bạn đã đạt hạng cao nhất!</p>
            )}
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#E8DCC8] flex items-center justify-center">
                <Package className="w-6 h-6 text-[#6B4423]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đơn hàng hoàn thành</p>
                <p className="text-2xl font-bold text-[#3A2416]">{completedOrders}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-lg font-bold text-green-700">₫</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                <p className="text-2xl font-bold text-green-700">{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#3A2416] mb-4">Menu nhanh</h3>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-[#E8DCC8]"
              onClick={() => router.push("/favorites")}
            >
              <Heart className="w-5 h-5 mr-3 text-[#6B4423]" />
              <span>Sản phẩm yêu thích</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-[#E8DCC8]"
              onClick={() => router.push("/order-tracking")}
            >
              <Package className="w-5 h-5 mr-3 text-[#6B4423]" />
              <span>Lịch sử đơn hàng</span>
            </Button>
          </div>
        </Card>

        {/* Orders Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#3A2416] mb-4">Đơn hàng gần đây</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bạn chưa có đơn hàng nào</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/order-tracking/${order.id}`)}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#3A2416]">Đơn #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-700">{order.total.toLocaleString()}đ</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
