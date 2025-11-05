import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  variant?: {
    id: string
    name: string
    priceDiff: number
  }
  modifiers?: Array<{
    modifierId: string
    optionLabel: string
    priceDiff: number
  }>
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  total: () => number
}

const isSameItem = (a: CartItem, b: CartItem) => {
  if (a.productId !== b.productId) return false
  
  // So sánh variant (undefined === undefined là true)
  const aVariant = a.variant?.id || null
  const bVariant = b.variant?.id || null
  if (aVariant !== bVariant) return false
  
  // So sánh modifiers
  const aModifiers = (a.modifiers || []).map(m => m.modifierId).sort().join(',')
  const bModifiers = (b.modifiers || []).map(m => m.modifierId).sort().join(',')
  return aModifiers === bModifiers
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => isSameItem(i, item))
          if (existing) {
            return {
              items: state.items.map((i) => 
                isSameItem(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
      total: () => {
        const state = get()
        return state.items.reduce((sum, item) => {
          const itemTotal =
            (item.price +
              (item.variant?.priceDiff || 0) +
              (item.modifiers?.reduce((m, mod) => m + mod.priceDiff, 0) || 0)) *
            item.quantity
          return sum + itemTotal
        }, 0)
      },
    }),
    {
      name: "cart-storage-v2",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Gộp các items trùng lặp khi load từ localStorage
          const mergedItems: CartItem[] = []
          state.items.forEach(item => {
            const existing = mergedItems.find(i => isSameItem(i, item))
            if (existing) {
              existing.quantity += item.quantity
            } else {
              mergedItems.push({ ...item })
            }
          })
          state.items = mergedItems
        }
      },
    },
  ),
)
