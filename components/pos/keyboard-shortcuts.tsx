"use client"

import { useEffect } from "react"
import { toast } from "sonner"

interface KeyboardShortcutsProps {
  onCreateWalkin: () => void
  onRefresh: () => void
}

export function KeyboardShortcuts({ onCreateWalkin, onRefresh }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault()
            onCreateWalkin()
            toast.info("Tạo đơn lẻ (Ctrl+N)")
            break
          case "r":
            e.preventDefault()
            onRefresh()
            toast.info("Làm mới (Ctrl+R)")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onCreateWalkin, onRefresh])

  return null
}
