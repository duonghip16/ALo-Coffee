"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    size?: string
    toppings?: string[]
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const itemTotal = item.price * item.quantity

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-[#8B6F47] rounded-lg border border-[#E8DCC8] dark:border-[#6B4423]">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-[#3A2416] dark:text-[#FEF7ED]">{item.name}</h3>
        {item.size && (
          <p className="text-sm text-[#3A2416]/70 dark:text-[#FEF7ED]/80">Size: {item.size}</p>
        )}
        {item.toppings && item.toppings.length > 0 && (
          <p className="text-sm text-[#3A2416]/70 dark:text-[#FEF7ED]/80">
            Topping: {item.toppings.join(", ")}
          </p>
        )}
        <p className="text-lg font-bold text-[#6B4423] dark:text-[#FEF7ED] mt-1">
          {itemTotal.toLocaleString()}đ
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeItem(item.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
