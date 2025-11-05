import { db } from "./firebase-client"
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"

export type LoyaltyTier = "bronze" | "silver" | "gold"

export interface LoyaltyData {
  userId: string
  points: number
  tier: LoyaltyTier
  totalSpent: number
  ordersCount: number
  createdAt: Date
  updatedAt: Date
}

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1000
}

const POINTS_PER_1000VND = 1

export function calculateTier(points: number): LoyaltyTier {
  if (points >= TIER_THRESHOLDS.gold) return "gold"
  if (points >= TIER_THRESHOLDS.silver) return "silver"
  return "bronze"
}

export function calculatePointsFromAmount(amount: number): number {
  return Math.floor(amount / 1000) * POINTS_PER_1000VND
}

export function getNextTierInfo(currentPoints: number) {
  const currentTier = calculateTier(currentPoints)
  
  if (currentTier === "gold") {
    return { nextTier: null, pointsNeeded: 0, progress: 100 }
  }
  
  const nextTier = currentTier === "bronze" ? "silver" : "gold"
  const nextThreshold = TIER_THRESHOLDS[nextTier]
  const pointsNeeded = nextThreshold - currentPoints
  const previousThreshold = currentTier === "bronze" ? 0 : TIER_THRESHOLDS.silver
  const progress = ((currentPoints - previousThreshold) / (nextThreshold - previousThreshold)) * 100
  
  return { nextTier, pointsNeeded, progress: Math.min(progress, 100) }
}

export async function getLoyaltyData(userId: string): Promise<LoyaltyData | null> {
  try {
    const docRef = doc(db, "loyalty", userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as LoyaltyData
    }
    return null
  } catch (error) {
    console.error("Error getting loyalty data:", error)
    return null
  }
}

export async function initializeLoyalty(userId: string): Promise<void> {
  try {
    const docRef = doc(db, "loyalty", userId)
    await setDoc(docRef, {
      userId,
      points: 0,
      tier: "bronze",
      totalSpent: 0,
      ordersCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  } catch (error) {
    console.error("Error initializing loyalty:", error)
  }
}

export async function addLoyaltyPoints(userId: string, orderAmount: number): Promise<void> {
  try {
    const docRef = doc(db, "loyalty", userId)
    const points = calculatePointsFromAmount(orderAmount)
    
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      await initializeLoyalty(userId)
    }
    
    await updateDoc(docRef, {
      points: increment(points),
      totalSpent: increment(orderAmount),
      ordersCount: increment(1),
      updatedAt: new Date()
    })
    
    const updatedDoc = await getDoc(docRef)
    const data = updatedDoc.data()
    if (data) {
      const newTier = calculateTier(data.points)
      if (newTier !== data.tier) {
        await updateDoc(docRef, { tier: newTier })
      }
    }
  } catch (error) {
    console.error("Error adding loyalty points:", error)
  }
}
