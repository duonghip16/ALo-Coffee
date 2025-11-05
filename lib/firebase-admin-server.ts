// ⚠️ CHỈ dùng trong Server Components hoặc API Routes
// KHÔNG import file này trong Client Components

import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

let app: App

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
} else {
  app = getApps()[0]
}

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)

// Ví dụ sử dụng trong API Route:
// import { adminDb } from "@/lib/firebase-admin-server"
// const orders = await adminDb.collection("orders").get()
