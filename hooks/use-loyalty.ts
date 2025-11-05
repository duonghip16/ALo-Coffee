import { useState, useEffect } from "react"
import { getLoyaltyData, type LoyaltyData, getNextTierInfo } from "@/lib/loyalty-service"
import { useAuth } from "@/context/auth-context"

export function useLoyalty() {
  const { user } = useAuth()
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoyalty(null)
      setLoading(false)
      return
    }

    const fetchLoyalty = async () => {
      setLoading(true)
      const data = await getLoyaltyData(user.id)
      setLoyalty(data)
      setLoading(false)
    }

    fetchLoyalty()
  }, [user])

  const tierInfo = loyalty ? getNextTierInfo(loyalty.points) : null

  return { loyalty, loading, tierInfo }
}
