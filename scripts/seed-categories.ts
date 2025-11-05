import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  })
}

const db = getFirestore()

const categories = [
  { name: 'Cà phê', slug: 'ca-phe', order: 1, active: true },
  { name: 'Trà', slug: 'tra', order: 2, active: true },
  { name: 'Trà sữa', slug: 'tra-sua', order: 3, active: true },
  { name: 'Nước ngọt', slug: 'nuoc-ngot', order: 4, active: true },
  { name: 'Khác', slug: 'khac', order: 5, active: true },
]

async function seedCategories() {
  console.log('🌱 Bắt đầu seed categories...')

  for (const category of categories) {
    const snapshot = await db.collection('categories')
      .where('slug', '==', category.slug)
      .get()

    if (snapshot.empty) {
      await db.collection('categories').add(category)
      console.log(`✅ Đã thêm: ${category.name}`)
    } else {
      console.log(`⏭️  Đã tồn tại: ${category.name}`)
    }
  }

  console.log('✨ Hoàn thành!')
  process.exit(0)
}

seedCategories().catch(error => {
  console.error('❌ Lỗi:', error)
  process.exit(1)
})
