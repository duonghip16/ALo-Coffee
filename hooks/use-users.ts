import { useEffect, useState } from "react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase-client"

export interface User {
  uid: string
  name: string
  phone?: string
  role: "admin" | "customer"
  status: "active" | "inactive" | "locked"
  avatarUrl?: string
  createdAt: number | any
  updatedAt: number | any
  isArchived?: boolean
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() } as User))
        .filter((user) => !user.isArchived)
      setUsers(usersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { users, loading }
}
