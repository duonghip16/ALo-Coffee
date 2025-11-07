"use client"

import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name?: string
  email?: string
  photoURL?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-2xl",
  xl: "w-20 h-20 text-3xl"
}

export function UserAvatar({ name, email, photoURL, size = "md", className }: UserAvatarProps) {
  const initial = name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U"
  
  return (
    <div className={cn(
      "rounded-full bg-linear-to-br from-[#C47B3E] to-[#8E5522] flex items-center justify-center overflow-hidden shadow-md",
      sizeClasses[size],
      className
    )}>
      {photoURL ? (
        <img src={photoURL} alt={name || email || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold">{initial}</span>
      )}
    </div>
  )
}
