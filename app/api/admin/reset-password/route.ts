import { NextResponse } from "next/server"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { getVietnamTimestamp } from "@/lib/date-utils"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json()

    const hashedPassword = await hashPassword(newPassword)
    
    await updateDoc(doc(db, "users", userId), {
      passwordHash: hashedPassword,
      updatedAt: getVietnamTimestamp()
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
