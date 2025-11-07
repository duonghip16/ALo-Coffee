"use client"

import { db } from "@/lib/firebase-client"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { getVietnamTimestamp } from "@/lib/date-utils"

// Simple hash function (for demo - in production use proper hashing)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export interface CustomUser {
  id: string
  name: string
  phone: string
  email?: string
  passwordHash: string
  avatarUrl?: string
  photoURL?: string
  role: "customer" | "admin"
  status: "active" | "inactive"
  isArchived: boolean
  createdAt: any
  updatedAt: any
}

// Đăng ký
export async function signUpWithPhone(name: string, phone: string, password: string): Promise<CustomUser> {
  // Check phone đã tồn tại chưa
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("phone", "==", phone))
  const snapshot = await getDocs(q)
  
  if (!snapshot.empty) {
    throw new Error("Số điện thoại đã được đăng ký")
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Tạo user mới với status inactive
  const timestamp = getVietnamTimestamp()
  const docRef = await addDoc(usersRef, {
    name,
    phone,
    passwordHash,
    role: "customer",
    status: "inactive",
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp
  })

  return {
    id: docRef.id,
    name,
    phone,
    passwordHash,
    role: "customer",
    status: "inactive",
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// Đăng nhập
export async function signInWithPhone(phone: string, password: string): Promise<CustomUser> {
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("phone", "==", phone))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    throw new Error("Số điện thoại hoặc mật khẩu không đúng")
  }

  const userDoc = snapshot.docs[0]
  const userData = userDoc.data() as CustomUser
  
  // Verify password
  const hashedInput = await hashPassword(password)
  const isValid = hashedInput === userData.passwordHash
  
  if (!isValid) {
    throw new Error("Số điện thoại hoặc mật khẩu không đúng")
  }

  return {
    ...userData,
    id: userDoc.id
  }
}
