import { db } from "./firebase-client"
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore"
import type { Table, TableStatus } from "./types/pos"

const TABLES_COLLECTION = "tables"

export async function getTables(): Promise<Table[]> {
  const snapshot = await getDocs(collection(db, TABLES_COLLECTION))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table))
}

export async function getTable(id: string): Promise<Table | null> {
  const docRef = doc(db, TABLES_COLLECTION, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Table : null
}

export async function createTable(data: Omit<Table, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const now = Date.now()
  const docRef = await addDoc(collection(db, TABLES_COLLECTION), {
    ...data,
    status: data.status || "available",
    createdAt: now,
    updatedAt: now
  })
  return docRef.id
}

export async function updateTable(id: string, data: Partial<Table>): Promise<void> {
  const docRef = doc(db, TABLES_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Date.now()
  })
}

export async function deleteTable(id: string): Promise<void> {
  await deleteDoc(doc(db, TABLES_COLLECTION, id))
}

export async function updateTableStatus(id: string, status: TableStatus, currentOrderId?: string): Promise<void> {
  const docRef = doc(db, TABLES_COLLECTION, id)
  await updateDoc(docRef, {
    status,
    currentOrderId: currentOrderId || null,
    updatedAt: Date.now()
  })
}

export function subscribeToTables(callback: (tables: Table[]) => void) {
  return onSnapshot(collection(db, TABLES_COLLECTION), (snapshot) => {
    const tables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table))
    callback(tables)
  })
}
