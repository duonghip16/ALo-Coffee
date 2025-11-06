"use client"

import { db } from "@/lib/firebase-client"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore"
import { getVietnamTimestamp, getVietnamTime, isToday } from "@/lib/date-utils"

export interface User {
  id: string
  name: string
  phone: string
  email: string
  role: 'customer' | 'owner'
  createdAt: number
  lastLogin: number
  active: boolean
}

export interface Product {
  id: string
  name: string
  categoryId: string
  price: number
  imageUrl: string
  images?: string[]
  imagePublicId?: string // Cloudinary public ID for deletion
  variants: Array<{ name: string; priceDiff: number }>
  types?: string
  description: string
  available: boolean
  featured?: boolean
  createdAt: number
}

export interface Category {
  id: string
  name: string
  slug: string
  order: number
  active: boolean
}

export interface Review {
  id: string
  userId: string
  orderId: string
  rating: number
  comment: string
  createdAt: number
}

export interface Order {
  id: string
  userId: string
  code: string
  customerName: string
  phone: string
  orderType: 'dine-in' | 'takeaway' | 'delivery'
  tableNumber?: string
  address?: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    unitPrice: number
    variantId?: string
    modifiersChosen?: Array<{ modifierId: string; optionLabel: string; priceDiff: number }>
    note?: string
    status: 'queued' | 'making' | 'ready'
  }>
  subtotal: number
  discount: number
  total: number
  amounts?: {
    subtotal: number
    discount: number
    total: number
  }
  payment: {
    method: 'cash' | 'vietqr'
    status: 'pending' | 'paid'
    ref?: string
  }
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  table?: string
  refCode?: string
  createdAt: number
  updatedAt: number
  notes?: string
}

export interface Settings {
  shopName: string
  shopPhone: string
  shopAddress: string
  shopDescription: string
  shopEmail?: string
  shopMapUrl?: string
  bankAccount?: string
  bankCode?: string
  bankName?: string
  accountName?: string
  isOpen: boolean
  ownerUserId?: string
  theme?: {
    primaryColor: string
    logo?: string
  }
  openHours?: {
    [key: string]: { open: string; close: string }
  }
}

export interface Favorite {
  id: string
  userId: string
  productId: string
  createdAt: number
}

// User operations
export async function createUser(user: Omit<User, 'id'>) {
  const usersCollection = collection(db, "users")
  const docRef = await addDoc(usersCollection, user)
  return docRef.id
}

export async function getUserById(userId: string) {
  const userDoc = doc(db, "users", userId)
  const snapshot = await getDocs(query(collection(db, "users"), where("__name__", "==", userId)))
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User
}

export async function updateUser(userId: string, data: Partial<User>) {
  const userDoc = doc(db, "users", userId)
  await updateDoc(userDoc, { ...data, lastLogin: getVietnamTimestamp() })
}

// Product operations
export async function getProducts() {
  if (!db) return []
  const productsCollection = collection(db, "products")
  const snapshot = await getDocs(productsCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
}

export async function getMenuItems() {
  return getProducts()
}

export async function getProductsByCategory(categoryId: string) {
  const productsCollection = collection(db, "products")
  const q = query(productsCollection, where("categoryId", "==", categoryId), where("available", "==", true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
}

export async function addProduct(product: Omit<Product, "id">) {
  const productsCollection = collection(db, "products")
  const docRef = await addDoc(productsCollection, { ...product, createdAt: getVietnamTimestamp() })
  return docRef.id
}

export async function updateProduct(productId: string, product: Partial<Product>) {
  const productDoc = doc(db, "products", productId)
  await updateDoc(productDoc, product)
}

export async function deleteProduct(productId: string) {
  const productDoc = doc(db, "products", productId)
  await deleteDoc(productDoc)
}

// Category operations
export async function getCategories() {
  const categoriesCollection = collection(db, "categories")
  const q = query(categoriesCollection, where("active", "==", true))
  const snapshot = await getDocs(q)
  const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[]
  return categories.sort((a, b) => a.order - b.order)
}

export async function addCategory(category: Omit<Category, "id">) {
  const categoriesCollection = collection(db, "categories")
  const docRef = await addDoc(categoriesCollection, category)
  return docRef.id
}

export async function updateCategory(categoryId: string, category: Partial<Category>) {
  const categoryDoc = doc(db, "categories", categoryId)
  await updateDoc(categoryDoc, category)
}

// Order operations
export async function createOrder(order: Omit<Order, "id" | "code" | "createdAt" | "updatedAt">) {
  const code = `ALO${Math.floor(100000 + Math.random() * 900000)}`
  const ordersCollection = collection(db, "orders")
  
  // Loại bỏ các field undefined
  const cleanOrder: any = {
    userId: order.userId,
    customerName: order.customerName,
    phone: order.phone,
    orderType: order.orderType,
    code,
    items: order.items.map(item => {
      const cleanItem: any = {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        status: item.status
      }
      if (item.variantId) cleanItem.variantId = item.variantId
      if (item.modifiersChosen && item.modifiersChosen.length > 0) cleanItem.modifiersChosen = item.modifiersChosen
      if (item.note) cleanItem.note = item.note
      return cleanItem
    }),
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    amounts: {
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total
    },
    payment: {
      method: order.payment.method,
      status: order.payment.status,
      ...(order.payment.ref && { ref: order.payment.ref })
    },
    status: order.status,
    createdAt: getVietnamTimestamp(),
    updatedAt: getVietnamTimestamp()
  }

  // Thêm các field tùy chọn nếu có
  if (order.tableNumber) cleanOrder.tableNumber = order.tableNumber
  if (order.address) cleanOrder.address = order.address
  if (order.notes) cleanOrder.notes = order.notes
  if (order.refCode) cleanOrder.refCode = order.refCode
  if (order.table) cleanOrder.table = order.table

  console.log('Clean order before Firestore:', JSON.stringify(cleanOrder, null, 2))
  const docRef = await addDoc(ordersCollection, cleanOrder)
  return docRef.id
}

export async function getOrders(userId: string) {
  if (!userId) return []
  const ordersCollection = collection(db, "orders")
  const q = query(ordersCollection, where("userId", "==", userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[]
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const orderDoc = doc(db, "orders", orderId)
  await updateDoc(orderDoc, { status, updatedAt: getVietnamTimestamp() })
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: Order["payment"]["status"]) {
  const orderDoc = doc(db, "orders", orderId)
  await updateDoc(orderDoc, {
    "payment.status": paymentStatus,
    updatedAt: getVietnamTimestamp()
  })
}

export async function updateItemStatus(orderId: string, itemIndex: number, status: Order["items"][0]["status"]) {
  const orderDoc = doc(db, "orders", orderId)
  const fieldPath = `items.${itemIndex}.status`
  await updateDoc(orderDoc, {
    [fieldPath]: status,
    updatedAt: getVietnamTimestamp()
  })
}

export async function deleteOrder(orderId: string) {
  const orderDoc = doc(db, "orders", orderId)
  await deleteDoc(orderDoc)
}

export async function updateOrderItems(orderId: string, items: Order["items"]) {
  const orderDoc = doc(db, "orders", orderId)
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  await updateDoc(orderDoc, {
    items,
    subtotal,
    total: subtotal,
    amounts: {
      subtotal,
      discount: 0,
      total: subtotal
    },
    updatedAt: getVietnamTimestamp()
  })
}

// Review operations
export async function createReview(review: Omit<Review, 'id'>) {
  const reviewsCollection = collection(db, "reviews")
  const docRef = await addDoc(reviewsCollection, { ...review, createdAt: getVietnamTimestamp() })
  return docRef.id
}

export async function getReviewsByProduct(productId: string) {
  const reviewsCollection = collection(db, "reviews")
  const q = query(reviewsCollection, where("productId", "==", productId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[]
}

export async function getReviewsByOrder(orderId: string) {
  const reviewsCollection = collection(db, "reviews")
  const q = query(reviewsCollection, where("orderId", "==", orderId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[]
}

export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void,
  onError?: (error: Error) => void,
) {
  if (!db || !userId) {
    callback([])
    return () => {}
  }
  const ordersCollection = collection(db, "orders")
  const q = query(ordersCollection, where("userId", "==", userId))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[]
      orders.sort((a, b) => b.createdAt - a.createdAt)
      callback(orders)
    },
    (error) => {
      if (onError) onError(error as Error)
    },
  )

  return unsubscribe
}

export function subscribeToOrder(
  orderId: string,
  callback: (order: Order | null) => void,
  onError?: (error: Error) => void,
) {
  const orderDoc = doc(db, "orders", orderId)

  const unsubscribe = onSnapshot(
    orderDoc,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() } as Order)
      } else {
        callback(null)
      }
    },
    (error) => {
      if (onError) onError(error as Error)
    },
  )

  return unsubscribe
}

export function subscribeToAllOrders(callback: (orders: Order[]) => void, onError?: (error: Error) => void) {
  if (!db) {
    callback([])
    return () => {}
  }
  const ordersCollection = collection(db, "orders")

  const unsubscribe = onSnapshot(
    ordersCollection,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[]
      orders.sort((a, b) => b.createdAt - a.createdAt)
      callback(orders)
    },
    (error) => {
      if (onError) onError(error as Error)
    },
  )

  return unsubscribe
}

export async function getOrderStats() {
  const ordersCollection = collection(db, "orders")
  const snapshot = await getDocs(ordersCollection)

  const orders = snapshot.docs.map((doc) => doc.data()) as Order[]

  const todayOrders = orders.filter(o => o.createdAt && isToday(o.createdAt))

  const stats = {
    total: orders.length,
    today: todayOrders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
  }

  return stats
}

export async function getSettings(): Promise<Settings> {
  const settingsCollection = collection(db, "settings")
  const snapshot = await getDocs(settingsCollection)
  if (snapshot.empty) {
    return {
      shopName: "ALo Coffee",
      shopPhone: "0932653465",
      shopAddress: "149/10 Bùi Văn Ngữ, Phường Hiệp Thành, Quận 12",
      shopDescription: "ALo Coffee – nơi bạn dừng chân giữa Sài Gòn nhộn nhịp để tìm lại một khoảnh khắc thanh thản",
      bankAccount: "1581686879",
      bankCode: "VCB",
      bankName: "Techcombank",
      accountName: "Phạm Quang Cường",
      isOpen: true,
      theme: {
        primaryColor: "#8B4513"
      },
      openHours: {
        monday: { open: "07:00", close: "22:00" },
        tuesday: { open: "07:00", close: "22:00" },
        wednesday: { open: "07:00", close: "22:00" },
        thursday: { open: "07:00", close: "22:00" },
        friday: { open: "07:00", close: "22:00" },
        saturday: { open: "07:00", close: "22:00" },
        sunday: { open: "07:00", close: "22:00" }
      }
    }
  }
  return snapshot.docs[0].data() as Settings
}

export async function updateSettings(settings: Partial<Settings>) {
  const settingsCollection = collection(db, "settings")
  const snapshot = await getDocs(settingsCollection)

  if (snapshot.empty) {
    await addDoc(settingsCollection, settings)
  } else {
    const settingsDoc = doc(db, "settings", snapshot.docs[0].id)
    await updateDoc(settingsDoc, settings)
  }

  // Sync payment settings to separate document
  if (settings.bankAccount || settings.bankName || settings.accountName) {
    const paymentDoc = doc(db, "settings", "payment")
    await updateDoc(paymentDoc, {
      bankAccount: settings.bankAccount,
      bankName: settings.bankName,
      accountName: settings.accountName
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, "settings"), {
        bankAccount: settings.bankAccount || "1581686879",
        bankName: settings.bankName || "Techcombank",
        accountName: settings.accountName || "Phạm Quang Cường"
      })
    })
  }
}

// Favorites operations
export async function addToFavorites(userId: string, productId: string) {
  if (!userId || !productId) return
  const favoritesCollection = collection(db, "favorites")
  const q = query(favoritesCollection, where("userId", "==", userId), where("productId", "==", productId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    await addDoc(favoritesCollection, {
      userId,
      productId,
      createdAt: getVietnamTimestamp(),
    })
  }
}

export async function removeFromFavorites(userId: string, productId: string) {
  if (!userId || !productId) return
  const favoritesCollection = collection(db, "favorites")
  const q = query(favoritesCollection, where("userId", "==", userId), where("productId", "==", productId))
  const snapshot = await getDocs(q)

  snapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
}

export function subscribeToFavorites(userId: string, callback: (favorites: Favorite[]) => void) {
  if (!db || !userId) {
    callback([])
    return () => {}
  }
  
  const favoritesCollection = collection(db, "favorites")
  const q = query(favoritesCollection, where("userId", "==", userId))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const favorites = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Favorite[]
    callback(favorites)
  })

  return unsubscribe
}

export async function checkIsFavorite(userId: string, productId: string): Promise<boolean> {
  if (!userId || !productId) return false
  const favoritesCollection = collection(db, "favorites")
  const q = query(favoritesCollection, where("userId", "==", userId), where("productId", "==", productId))
  const snapshot = await getDocs(q)
  return !snapshot.empty
}
