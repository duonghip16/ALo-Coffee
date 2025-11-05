"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { signUpWithPhone as customSignUp, signInWithPhone as customSignIn, type CustomUser } from "@/lib/custom-auth"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase-client"

interface AuthContextType {
  user: CustomUser | null
  loading: boolean
  error: string | null
  signUpWithPhone: (name: string, phone: string, password: string) => Promise<void>
  signInWithPhone: (phone: string, password: string) => Promise<void>
  logout: () => void
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signUpWithPhone: async () => {},
  signInWithPhone: async () => {},
  logout: async () => {},
  isConfigured: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured] = useState(true)

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('alo-user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      
      // Subscribe to realtime updates
      if (parsedUser.id) {
        const unsubscribe = onSnapshot(doc(db, "users", parsedUser.id), (snapshot) => {
          if (snapshot.exists()) {
            const updatedUser = { id: snapshot.id, ...snapshot.data() } as CustomUser
            setUser(updatedUser)
            localStorage.setItem('alo-user', JSON.stringify(updatedUser))
          }
        })
        
        setLoading(false)
        return unsubscribe
      }
    }
    setLoading(false)
  }, [])

  const signUpWithPhone = async (name: string, phone: string, password: string) => {
    const newUser = await customSignUp(name, phone, password)
    setUser(newUser)
    localStorage.setItem('alo-user', JSON.stringify(newUser))
  }

  const signInWithPhone = async (phone: string, password: string) => {
    const loggedInUser = await customSignIn(phone, password)
    setUser(loggedInUser)
    localStorage.setItem('alo-user', JSON.stringify(loggedInUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('alo-user')
  }

  return <AuthContext.Provider value={{ user, loading, error, signUpWithPhone, signInWithPhone, logout, isConfigured }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
