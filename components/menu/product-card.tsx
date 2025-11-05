"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

import type { Product } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Heart, Plus, Minus } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/hooks/use-cart"
import { HoverLift, Pulse, FadeInUp } from "@/components/ui/micro-interactions"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) return
    await toggleFavorite(product.id)
  }

  const calculateTotalPrice = () => {
    let price = product.price

    // Add variant price
    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.id === selectedVariant)
      if (variant) price += variant.priceDiff
    }

    // Add modifiers price
    if (product.modifiers) {
      selectedModifiers.forEach(modifierId => {
        const modifier = product.modifiers?.find(m => m.id === modifierId)
        if (modifier) {
          modifier.options.forEach(option => {
            price += option.priceDiff
          })
        }
      })
    }

    return price * quantity
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng")
      return
    }
    
    if (user.status !== "active") {
      toast.error("Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên.")
      return
    }

    const variant = selectedVariant && product.variants ?
      product.variants.find(v => v.id === selectedVariant) : undefined
    
    const modifiers = selectedModifiers.map(modifierId => {
      const modifier = product.modifiers?.find(m => m.id === modifierId)
      return modifier ? {
        modifierId,
        optionLabel: modifier.name,
        priceDiff: modifier.options.reduce((sum, opt) => sum + opt.priceDiff, 0)
      } : null
    }).filter(Boolean) as any[]

    const cartItem = {
      id: `${product.id}-${variant?.id || 'default'}-${modifiers.map(m => m.modifierId).sort().join('-')}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      variant,
      modifiers
    }

    addItem(cartItem)
    setIsOpen(false)
    // Reset selections
    setSelectedVariant("")
    setSelectedModifiers([])
    setQuantity(1)
  }

  const hasCustomizations = product.variants || product.modifiers

  return (
    <FadeInUp>
      <HoverLift>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative group">
              <motion.div
                className="relative h-40 bg-muted overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {product.image ? (
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-beige-200">
                    <motion.svg
                      className="w-8 h-8 text-coffee-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </motion.svg>
                  </div>
                )}
                {user && (
                  <motion.button
                    onClick={handleFavoriteToggle}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart size={20} className={isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </motion.button>
                )}
              </motion.div>
              <div className="p-3">
                <h3 className="font-semibold text-coffee-900 truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-coffee-700">{product.price.toLocaleString()}đ</span>
                  <Pulse>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        if (hasCustomizations) {
                          setIsOpen(true)
                        } else {
                          onAddToCart(product)
                        }
                      }}
                      className="bg-coffee-700 hover:bg-coffee-900"
                    >
                      {hasCustomizations ? "Tùy chọn" : "Thêm"}
                    </Button>
                  </Pulse>
                </div>
              </div>
            </Card>
          </SheetTrigger>

      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle className="text-left">{product.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Chọn size</h4>
              <RadioGroup value={selectedVariant} onValueChange={setSelectedVariant}>
                {product.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={variant.id} id={variant.id} />
                    <Label htmlFor={variant.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>{variant.name}</span>
                        <span className="text-coffee-700">
                          {variant.priceDiff > 0 ? `+${variant.priceDiff.toLocaleString()}đ` : 'Miễn phí'}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Modifiers */}
          {product.modifiers && product.modifiers.map((modifier) => (
            <div key={modifier.id} className="mb-6">
              <h4 className="font-semibold mb-3">{modifier.name}</h4>
              <div className="space-y-2">
                {modifier.options.map((option) => (
                  <div key={option.label} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.label}
                      checked={selectedModifiers.includes(modifier.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedModifiers([...selectedModifiers, modifier.id])
                        } else {
                          setSelectedModifiers(selectedModifiers.filter(id => id !== modifier.id))
                        }
                      }}
                    />
                    <Label htmlFor={option.label} className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        <span className="text-coffee-700">
                          {option.priceDiff > 0 ? `+${option.priceDiff.toLocaleString()}đ` : 'Miễn phí'}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Số lượng</h4>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Tổng:</span>
            <span className="text-xl font-bold text-coffee-700">
              {calculateTotalPrice().toLocaleString()}đ
            </span>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-coffee-700 hover:bg-coffee-900"
            size="lg"
          >
            Thêm vào giỏ - {calculateTotalPrice().toLocaleString()}đ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
      </HoverLift>
    </FadeInUp>
  )
}
