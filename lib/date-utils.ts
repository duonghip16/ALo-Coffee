// Vietnam timezone utilities (UTC+7)

export function getVietnamTime(): Date {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (3600000 * 7))
}

export function getVietnamTimestamp(): number {
  return getVietnamTime().getTime()
}

export function formatVietnamDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
}

export function formatVietnamDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString("vi-VN", { 
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export function formatVietnamTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("vi-VN", { 
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp)
  const today = getVietnamTime()
  return date.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) === 
         today.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
}
