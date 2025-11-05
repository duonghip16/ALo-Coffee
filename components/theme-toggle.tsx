"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[#3A2416] dark:bg-[#FEF7ED] shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[#3A2416]" />
      ) : (
        <Moon className="h-5 w-5 text-[#FEF7ED]" />
      )}
    </motion.button>
  )
}
