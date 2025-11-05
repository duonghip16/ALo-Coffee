"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface ProductDetailModalProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
    rating: number
    sizes?: Array<{ name: string; priceDiff: number }>
    toppings?: Array<{ name: string; price: number }>
  }
  open: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.name || "")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])

  const calculateTotal = () => {
    let total = product.price
    
    if (selectedSize && product.sizes) {
      const size = product.sizes.find(s => s.name === selectedSize)
      if (size) total += size.priceDiff
    }
    
    if (product.toppings) {
      selectedToppings.forEach(toppingName => {
        const topping = product.toppings?.find(t => t.name === toppingName)
        if (topping) total += topping.price
      })
    }
    
    return total * quantity
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      toppings: selectedToppings
    })
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
    onClose()
    setQuantity(1)
    setSelectedToppings([])
  }

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">• {product.description}</span>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Chọn size</h3>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <Button
                    key={size.name}
                    variant={selectedSize === size.name ? "default" : "outline"}
                    onClick={() => setSelectedSize(size.name)}
                    className="flex-1"
                  >
                    {size.name}
                    {size.priceDiff > 0 && ` (+${size.priceDiff.toLocaleString()}đ)`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.toppings && product.toppings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Topping</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.toppings.map(topping => (
                  <Button
                    key={topping.name}
                    variant={selectedToppings.includes(topping.name) ? "default" : "outline"}
                    onClick={() => toggleTopping(topping.name)}
                    className="justify-between"
                  >
                    <span>{topping.name}</span>
                    <span>+{topping.price.toLocaleString()}đ</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-semibold">Số lượng</span>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Tổng cộng</p>
              <p className="text-2xl font-bold text-coffee-700">
                {calculateTotal().toLocaleString()}đ
              </p>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="px-8">
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
