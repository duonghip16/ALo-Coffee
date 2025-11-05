import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-client'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'

const categories = [
  { name: 'Cà phê', slug: 'ca-phe', order: 1, active: true },
  { name: 'Trà', slug: 'tra', order: 2, active: true },
  { name: 'Trà sữa', slug: 'tra-sua', order: 3, active: true },
  { name: 'Nước ngọt', slug: 'nuoc-ngot', order: 4, active: true },
  { name: 'Khác', slug: 'khac', order: 5, active: true },
]

export async function GET() {
  try {
    const results = []

    for (const category of categories) {
      const q = query(collection(db, 'categories'), where('slug', '==', category.slug))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        await addDoc(collection(db, 'categories'), category)
        results.push({ status: 'added', name: category.name })
      } else {
        results.push({ status: 'exists', name: category.name })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Error seeding categories:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
