"use client"

import { motion } from "framer-motion"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import type { Product } from "@/lib/firestore-service"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

export function FeaturedProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const q = query(collection(db, "products"), where("featured", "==", true), where("available", "==", true))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const featuredProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
      setProducts(featuredProducts.slice(0, 4))
    })
    return () => unsubscribe()
  }, [])

  return (
    <section className="py-20 bg-[#b29268] dark:bg-[#3a2c1b]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#3A2416] dark:text-[#FEF7ED] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-[#3A2416]/70 dark:text-[#FEF7ED] max-w-2xl mx-auto">
            Những món được yêu thích nhất tại ALo Coffee
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer bg-[#ad8249] dark:bg-card border-[#E8DCC8] dark:border-border">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images?.[0] || product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div className="p-2.5 sm:p-4">
                  <h3 className="font-bold text-sm sm:text-lg text-[#3A2416] dark:text-[#FEF7ED] mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-[#3A2416]/70 dark:text-[#FEF7ED] mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-xl font-bold text-[#603f24] dark:text-[#ffe0b5]">
                      {product.price.toLocaleString()}đ
                    </span>
                    <Button 
                      size="sm" 
                      className="rounded-full h-7 w-7 sm:h-9 sm:w-auto sm:px-3 p-0"
                      onClick={() => {
                        if (!user) {
                          toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng")
                          return
                        }
                        if (user.status !== "active") {
                          toast.error("Tài khoản của bạn chưa được kích hoạt")
                          return
                        }
                        addItem({
                          id: product.id,
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          imageUrl: product.imageUrl,
                          images: product.images,
                          quantity: 1
                        })
                        toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={() => router.push("/menu")}
            className="rounded-full px-8 text-[#0a0806]"
          >
            Xem toàn bộ menu
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
