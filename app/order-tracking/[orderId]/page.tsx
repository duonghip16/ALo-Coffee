"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useOrderDetail } from "@/hooks/use-order-detail"
import { OrderDetailView } from "@/components/tracking/order-detail-view"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const orderId = params.orderId as string
  const { order, loading } = useOrderDetail(orderId)

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
          <p className="text-muted-foreground">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!user || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => router.push("/order-tracking")} className="bg-coffee-700 hover:bg-coffee-900">
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#c19c8a]">
      {/* Header */}
      <div className="bg-[#FEF7ED] dark:bg-[#3A2C20] shadow-sm border-b border-border sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-coffee-700 hover:text-coffee-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-coffee-900 dark:text-[#dcc9ad]">Chi tiết đơn hàng</h1>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <OrderDetailView order={order} />

        <div className="mt-6">
          <Button onClick={() => router.push("/menu")} variant="outline" className="w-full">
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )
}
