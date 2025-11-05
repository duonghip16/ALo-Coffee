import * as admin from "firebase-admin"

// Initialize Firebase Admin (for server-side operations)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()

export default admin
