export interface Notification {
  id: string
  userId: string
  orderId: string
  title: string
  message: string
  type: "order" | "payment" | "status"
  read: boolean
  createdAt: number
}

// Browser notification helper
export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return true
      }
    })
  }
  return false
}

export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options)
  }
}

export const ORDER_STATUS_MESSAGES: Record<string, { title: string; message: string }> = {
  pending: {
    title: "Đơn hàng chờ xác nhận",
    message: "Đơn hàng của bạn đã được ghi nhận",
  },
  confirmed: {
    title: "Đơn hàng đã được xác nhận",
    message: "Quán đã xác nhận đơn hàng của bạn",
  },
  preparing: {
    title: "Đơn hàng đang chuẩn bị",
    message: "Đơn hàng của bạn đang được chuẩn bị",
  },
  ready: {
    title: "Đơn hàng sẵn sàng",
    message: "Đơn hàng của bạn đã sẵn sàng",
  },
  completed: {
    title: "Đơn hàng hoàn thành",
    message: "Cảm ơn bạn đã mua hàng tại ALo Coffee",
  },
}
