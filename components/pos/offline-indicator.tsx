"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { isOnline, onOnlineStatusChange } from "@/lib/offline-service"

export function OfflineIndicator() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setOnline(isOnline())
    const cleanup = onOnlineStatusChange(setOnline)
    return cleanup
  }, [])

  if (online) return null

  return (
    <Badge variant="destructive" className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <WifiOff className="w-4 h-4" />
      Offline Mode
    </Badge>
  )
}
