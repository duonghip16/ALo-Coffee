"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function OrderConfirmation() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-coffee-900 mb-2">Đơn hàng thành công</h1>
          <p className="text-muted-foreground">Cảm ơn bạn đã đặt hàng tại ALo Coffee</p>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-1">Mã đơn hàng</p>
          <p className="font-mono font-bold text-coffee-900">{orderId}</p>
        </div>

        <div className="text-sm text-muted-foreground mb-6 space-y-2">
          <p>Đơn hàng của bạn đang được chuẩn bị</p>
          <p>Bạn sẽ nhận được thông báo khi đơn hàng được xác nhận</p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => router.push("/order-tracking")}
            className="w-full bg-coffee-700 hover:bg-coffee-900 text-white"
          >
            Theo dõi đơn hàng
          </Button>
          <Button onClick={() => router.push("/menu")} variant="outline" className="w-full">
            Tiếp tục mua sắm
          </Button>
        </div>
      </Card>
    </div>
  )
}
