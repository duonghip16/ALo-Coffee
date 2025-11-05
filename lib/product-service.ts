"use client"

import { db } from "@/lib/firebase-client"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  imageUrl: string
  variants: Array<{ name: string; priceDiff: number }>
  toppings: Array<{ name: string; priceDiff: number }>
  description: string
  available: boolean
  createdAt: number
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("categoryId", "==", categoryId),
    where("available", "==", true),
    orderBy("createdAt", "desc")
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("available", "==", true),
    orderBy("createdAt", "desc")
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
}
