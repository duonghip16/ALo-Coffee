"use client"

import { useAuth } from "@/context/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useEffect, useState } from "react"
import { getMenuItems, type Product } from "@/lib/firestore-service"
import { ProductCard } from "@/components/menu/product-card"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function FavoritesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { favorites } = useFavorites()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [favoritedProducts, setFavoritedProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getMenuItems()
      setProducts(allProducts)
      setProductsLoading(false)
    }
    loadProducts()
  }, [])

  useEffect(() => {
    const favoriteProductIds = favorites.map((f) => f.productId)
    const filtered = products.filter((p) => favoriteProductIds.includes(p.id))
    setFavoritedProducts(filtered)
  }, [favorites, products])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  if (loading || productsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-[#F7EFE5] dark:bg-[#F7EFE5] pb-20">
      <div className="sticky top-0 bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#3A2416]" style={{ fontFamily: 'Playfair Display, serif' }}>Yêu thích</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favoritedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Bạn chưa lưu sản phẩm yêu thích nào</p>
            <Button onClick={() => router.push("/menu")} className="bg-[#6B4423] hover:bg-[#3A2416] text-[#FEF7ED]">
              Khám phá menu
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
