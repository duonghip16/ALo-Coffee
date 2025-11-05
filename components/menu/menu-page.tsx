"use client"

import { useState, useEffect, useCallback } from "react"
import { getMenuItems } from "@/lib/firestore-service"
import type { Product } from "@/lib/firestore-service"
import { ProductCard } from "./product-card"
import { useCart } from "@/hooks/use-cart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useOrderNotifications } from "@/hooks/use-order-notifications"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { User, Heart, Coffee, RefreshCw } from "lucide-react"
import { SkeletonGrid } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"

const CATEGORIES = [
  { id: "coffee", label: "Cà Phê" },
  { id: "tea", label: "Trà" },
  { id: "smoothie", label: "Trà Sữa" },
  { id: "beverage", label: "Nước Ngọt" },
]

export function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("coffee")
  const [refreshing, setRefreshing] = useState(false)
  const { addItem } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  useOrderNotifications()

  const loadMenu = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const items = await getMenuItems()
      setProducts(items)
    } catch (error) {
      console.error("Error loading menu:", error)
    } finally {
      setLoading(false)
      if (showRefresh) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadMenu()
  }, [loadMenu])

  const handleRefresh = useCallback(() => {
    loadMenu(true)
  }, [loadMenu])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  const filteredProducts = products.filter((p) => p.categoryId === selectedCategory)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-coffee-100 rounded-lg">
                <Coffee className="w-6 h-6 text-coffee-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-coffee-900">ALo Coffee</h1>
                <p className="text-sm text-muted-foreground">Nơi bạn tìm lại thanh thản</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/favorites")}
                title="Yêu thích"
                className="hover:bg-coffee-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/profile")}
                title="Tài khoản"
                className="hover:bg-coffee-50 transition-colors"
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 bg-transparent transition-all hover:scale-105"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-4 bg-muted/50 backdrop-blur-sm">
            {CATEGORIES.map((cat, index) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="text-coffee-700 transition-all duration-200 hover:scale-105 data-[state=active]:bg-coffee-100 data-[state=active]:text-coffee-900"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonGrid count={6} />
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Coffee className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không có sản phẩm trong danh mục này</p>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Pull to refresh indicator */}
              <AnimatePresence>
                {refreshing && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5 animate-spin text-coffee-700" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
