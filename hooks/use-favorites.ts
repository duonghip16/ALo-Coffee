"use client"

import { useEffect, useState } from "react"
import { subscribeToFavorites, addToFavorites, removeFromFavorites } from "@/lib/firestore-service"
import { useAuth } from "@/context/auth-context"

interface Favorite {
  id: string
  userId: string
  productId: string
  createdAt: number
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToFavorites(user.id, (data) => {
      setFavorites(data)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const toggleFavorite = async (productId: string) => {
    if (!user) return

    const isFavorite = favorites.some((fav) => fav.productId === productId)
    if (isFavorite) {
      await removeFromFavorites(user.id, productId)
    } else {
      await addToFavorites(user.id, productId)
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.productId === productId)
  }

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  }
}
