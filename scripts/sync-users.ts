import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, updateDoc, doc, deleteField } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function syncUsers() {
  console.log("🔄 Starting user sync...")
  
  try {
    const usersRef = collection(db, "users")
    const snapshot = await getDocs(usersRef)
    
    console.log(`📊 Found ${snapshot.size} users`)
    
    let updated = 0
    for (const userDoc of snapshot.docs) {
      const data = userDoc.data()
      
      if ('points' in data) {
        await updateDoc(doc(db, "users", userDoc.id), {
          points: deleteField()
        })
        console.log(`✅ Removed points from user: ${data.name || userDoc.id}`)
        updated++
      }
    }
    
    console.log(`\n✨ Sync completed! Updated ${updated} users`)
  } catch (error) {
    console.error("❌ Error syncing users:", error)
  }
}

syncUsers()
