"use client"

import { motion } from "framer-motion"
import { Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ProductDetailModal } from "./product-detail-modal"

interface MenuCardProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    imageUrl?: string
    images?: string[]
    description: string
    rating?: number
    available: boolean
    category?: string
    categoryId?: string
    sizes?: Array<{ name: string; priceDiff: number }>
    toppings?: Array<{ name: string; price: number }>
    variants?: Array<{ name: string; priceDiff: number }>
  }
  index?: number
}

export function MenuCard({ product, index = 0 }: MenuCardProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer bg-[#d1ac7b] dark:bg-card border-[#E8DCC8] dark:border-border">
          <div 
            className="relative aspect-square bg-muted overflow-hidden"
            onClick={() => setShowModal(true)}
          >
            <img
              src={product.images?.[0] || product.imageUrl || product.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {product.rating && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
            )}
            {!product.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Hết hàng</Badge>
              </div>
            )}
          </div>

          <div className="p-2.5 sm:p-4">
            <h3 className="font-bold text-sm sm:text-lg text-coffee-900 mb-0.5 sm:mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-xl font-bold text-coffee-700">
                {product.price.toLocaleString()}đ
              </span>
              <Button 
                size="sm" 
                className="rounded-full h-7 w-7 sm:h-9 sm:w-9 p-0"
                onClick={() => setShowModal(true)}
                disabled={!product.available}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <ProductDetailModal
        product={{
          ...product,
          rating: product.rating || 0
        }}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
