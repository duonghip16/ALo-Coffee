"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export function NotificationToggle() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission as NotificationPermission)
    }
  }, [])

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const handleRequestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleSound}
        title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        className={soundEnabled ? "bg-blue-50 border-blue-200" : ""}
      >
        {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
      </Button>

      {notificationPermission === "default" && (
        <Button variant="outline" size="sm" onClick={handleRequestNotifications}>
          Bật thông báo
        </Button>
      )}
      {notificationPermission === "denied" && <span className="text-xs text-red-600">Thông báo bị tắt</span>}
    </div>
  )
}
