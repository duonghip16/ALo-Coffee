"use client"

import type { Product } from "@/lib/firestore-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteProduct, updateProduct } from "@/lib/firestore-service"
import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Coffee, Edit3, Trash2, AlertTriangle, Star } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProductListAdminProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDeleteSuccess: (name: string) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  coffee: "Cà Phê",
  tea: "Trà",
  smoothie: "Trà Sữa",
  beverage: "Nước Ngọt",
}

export function ProductListAdmin({ products, onEdit, onDeleteSuccess }: ProductListAdminProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [error, setError] = useState("")

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setDeleting(productToDelete.id)
    setError("")
    try {
      await deleteProduct(productToDelete.id)
      onDeleteSuccess(productToDelete.name)
      setProductToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi xóa")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold">
                    Xóa sản phẩm?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base mt-2">
                    Bạn có chắc chắn muốn xóa <span className="font-bold text-[#2A1A12] dark:text-[#FFF9F0]">"{productToDelete?.name}"</span> không?
                    <br />
                    <span className="text-red-600 dark:text-red-400 font-semibold">Hành động này không thể hoàn tác.</span>
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!deleting} className="font-semibold">
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={!!deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {deleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      <div>
      {error && (
        <Card className="p-4 mb-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {products.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-[#6B4423] border-[#E4D9C9] dark:border-[#7B5433]">
          <Coffee className="h-16 w-16 mx-auto text-muted-foreground dark:text-[#E8DCC8] mb-4 opacity-50" />
          <p className="text-lg font-semibold text-muted-foreground dark:text-[#E8DCC8]">Chưa có sản phẩm nào</p>
          <p className="text-sm text-muted-foreground dark:text-[#E8DCC8] mt-2">Thêm sản phẩm đầu tiên của bạn</p>
        </Card>
      ) : (
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
            {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.03, y: -2 }}
            >
              <Card className="bg-white dark:bg-[#6B4423] border-[#E4D9C9] dark:border-[#7B5433] hover:shadow-lg transition-all p-2.5 lg:p-4">
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs lg:text-base text-[#2A1A12] dark:text-[#E8DCC8] mb-0.5 lg:mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] lg:text-xs font-semibold text-[#2A1A12]/60 dark:text-[#E8DCC8]/80 line-clamp-1 lg:line-clamp-2 mb-1 lg:mb-2">
                      {product.description || 'Không có mô tả'}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] lg:text-xs px-1.5 lg:px-2 py-0.5 rounded-full font-bold whitespace-nowrap ml-1 lg:ml-2 shrink-0 ${
                      product.available 
                        ? "bg-[#EAF4ED] dark:bg-[#4A3420] text-[#2F855A] dark:text-[#90EE90]" 
                        : "bg-[#FEEAEA] dark:bg-[#5A3020] text-[#C53030] dark:text-[#FF6B6B]"
                    }`}
                  >
                    {product.available ? "• Còn" : "• Hết"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <p className="font-extrabold text-sm lg:text-lg text-[#C47B3E] dark:text-[#E8DCC8]">
                    {(product.price || 0).toLocaleString()}đ
                  </p>
                  {product.variants && product.variants.length > 0 && (
                    <span className="text-[9px] lg:text-xs font-semibold text-[#2A1A12]/60 dark:text-[#E8DCC8]/80">
                      {product.variants.length} size
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <Button
                    size="sm"
                    variant={product.featured ? "default" : "outline"}
                    onClick={async () => {
                      await updateProduct(product.id, { featured: !product.featured })
                      toast.success(product.featured ? "Đã bỏ nổi bật" : "Đã đặt nổi bật")
                    }}
                    className="w-full font-semibold h-7 lg:h-8 text-[10px] lg:text-xs"
                  >
                    <Star className={`h-2.5 w-2.5 lg:h-3 lg:w-3 mr-1 ${product.featured ? "fill-current" : ""}`} />
                    <span className="hidden sm:inline">{product.featured ? "Nổi bật" : "Đặt nổi bật"}</span>
                    <span className="sm:hidden">★</span>
                  </Button>
                  <div className="flex gap-1.5 lg:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(product)}
                      className="flex-1 font-semibold hover:bg-coffee-50 dark:hover:bg-[#5A3420] dark:text-[#E8DCC8] dark:border-[#7B5433] h-7 lg:h-8 text-[10px] lg:text-xs"
                    >
                      <Edit3 className="h-2.5 w-2.5 lg:h-3 lg:w-3 lg:mr-1" />
                      <span className="hidden sm:inline">Sửa</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setProductToDelete(product)}
                      disabled={deleting === product.id}
                      className="flex-1 font-semibold text-destructive hover:bg-destructive/10 h-7 lg:h-8 text-[10px] lg:text-xs"
                    >
                      <Trash2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 lg:mr-1" />
                      <span className="hidden sm:inline">{deleting === product.id ? "..." : "Xóa"}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            ))}
            </div>
          </AnimatePresence>
        </LayoutGroup>
      )}
      </div>
    </>
  )
}
