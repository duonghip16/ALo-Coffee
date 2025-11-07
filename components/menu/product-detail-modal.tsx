"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    imageUrl?: string
    images?: string[]
    description: string
    rating: number
    types?: string
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
  const [note, setNote] = useState("")
  const productTypes = product.types?.split(',').map(t => t.trim()).filter(t => t) || []
  const [selectedType, setSelectedType] = useState(productTypes[0] || "")

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
    const sizeData = product.sizes?.find(s => s.name === selectedSize)
    const modifiers = selectedToppings.map(toppingName => {
      const topping = product.toppings?.find(t => t.name === toppingName)
      return {
        modifierId: toppingName,
        optionLabel: toppingName,
        priceDiff: topping?.price || 0
      }
    })

    addItem({
      id: `${product.id}-${selectedSize}-${selectedType}-${selectedToppings.sort().join('-')}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      images: product.images,
      quantity,
      note: note.trim() || undefined,
      selectedType: selectedType || undefined,
      variant: sizeData ? {
        id: selectedSize,
        name: selectedSize,
        priceDiff: sizeData.priceDiff
      } : undefined,
      modifiers: modifiers.length > 0 ? modifiers : undefined
    })
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
    onClose()
    setQuantity(1)
    setSelectedToppings([])
    setNote("")
    setSelectedType(productTypes[0] || "")
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
      <DialogContent className="max-w-[85vw] sm:max-w-2xl max-h-[70vh] sm:max-h-[75vh] overflow-y-auto p-3 sm:p-6 bg-green-50! dark:bg-[#4A3426]!">
        <DialogHeader className="pb-1.5 sm:pb-2">
          <DialogTitle className="text-sm sm:text-xl font-bold">{product.name}</DialogTitle>
          <DialogDescription className="sr-only">{product.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 sm:space-y-3">
          {/* Mobile: Image + Description side by side */}
          <div className="flex sm:block gap-2 sm:gap-0">
            <div className="aspect-square sm:aspect-3/2 bg-muted rounded-lg overflow-hidden w-[60%] sm:w-auto sm:max-w-xs sm:mx-auto shrink-0">
              <img
                src={product.images?.[0] || product.imageUrl || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-1 sm:hidden flex-1">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-xs">{product.rating}</span>
              </div>
              <p className="text-[15px] text-muted-foreground leading-tight">{product.description}</p>
            </div>
          </div>

          {/* Desktop: Description below image */}
          <div className="hidden sm:flex items-center gap-2 text-base">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground text-sm">• {product.description}</span>
          </div>

          {productTypes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1.5 sm:mb-3 text-xs sm:text-base">Tùy chọn</h3>
              <div className="flex gap-1.5 sm:gap-3">
                {productTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => setSelectedType(type)}
                    className="flex-1 text-[10px] sm:text-sm h-7 sm:h-10 px-2 sm:px-4"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1.5 sm:mb-3 text-xs sm:text-base">Chọn size</h3>
              <div className="flex gap-1.5 sm:gap-3">
                {product.sizes.map(size => (
                  <Button
                    key={size.name}
                    variant={selectedSize === size.name ? "default" : "outline"}
                    onClick={() => setSelectedSize(size.name)}
                    className="flex-1 text-[10px] sm:text-sm h-7 sm:h-10 px-2 sm:px-4"
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
              <h3 className="font-semibold mb-1.5 sm:mb-3 text-xs sm:text-base">Topping</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                {product.toppings.map(topping => (
                  <Button
                    key={topping.name}
                    variant={selectedToppings.includes(topping.name) ? "default" : "outline"}
                    onClick={() => toggleTopping(topping.name)}
                    className="justify-between text-[10px] sm:text-sm h-7 sm:h-10 px-2 sm:px-4"
                  >
                    <span>{topping.name}</span>
                    <span>+{topping.price.toLocaleString()}đ</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-1 sm:p-4 bg-green-100 dark:bg-[#5A4436] rounded-lg">
            <span className="font-bold text-[15px] sm:text-base">Số lượng</span>
            <div className="flex items-center gap-0.5 sm:gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-4 w-4 sm:h-10 sm:w-10 p-0"
              >
                <Minus className="w-2 h-2 sm:w-4 sm:h-4" />
              </Button>
              <span className="text-[10px] sm:text-xl font-bold w-4 sm:w-8 text-center">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                className="h-4 w-4 sm:h-10 sm:w-10 p-0"
              >
                <Plus className="w-2 h-2 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 block">Ghi chú (tùy chọn)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Ít đường, nhiều đá..."
              rows={2}
              maxLength={200}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 resize-none"
            />
            <p className="text-[9px] sm:text-xs text-muted-foreground mt-1">{note.length}/200 ký tự</p>
          </div>

          <div className="flex items-center justify-between pt-2 sm:pt-4 border-t">
            <div>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Tổng cộng</p>
              <p className="text-base sm:text-2xl font-bold text-coffee-700">
                {calculateTotal().toLocaleString()}đ
              </p>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="px-3 sm:px-8 text-xs sm:text-base h-8 sm:h-11">
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
