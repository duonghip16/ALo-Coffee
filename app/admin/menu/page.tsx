"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import type { Product } from "@/lib/firestore-service"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MenuForm } from "@/components/admin/menu-form"
import { ProductListAdmin } from "@/components/admin/product-list-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, Search, Coffee, Leaf, IceCream, Droplets, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminMenuPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("coffee")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Product[] = []
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product)
      })
      setProducts(items)
      setLoading(false)
    }, (error) => {
      console.error("Error loading menu:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-700 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải menu...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSuccess = (action: "add" | "update", productName?: string) => {
    setEditingProduct(undefined)
    setIsFormOpen(false)
    
    const messages = {
      add: `✅ Đã thêm sản phẩm mới: ${productName}`,
      update: `📝 Đã lưu thay đổi món '${productName}'`,
    }
    
    toast.success(messages[action])
  }

  const handleDeleteSuccess = (productName: string) => {
    toast.success(`🗑️ Đã xóa sản phẩm ${productName}`)
  }

  const categories = [
    { id: "coffee", label: "Cà phê", icon: Coffee },
    { id: "tea", label: "Trà", icon: Leaf },
    { id: "smoothie", label: "Trà sữa", icon: IceCream },
    { id: "beverage", label: "Nước ngọt", icon: Droplets },
    { id: "other", label: "Khác", icon: MoreHorizontal },
  ]

  const getFilteredProducts = (categoryId: string) => {
    return products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true
      const matchesCategory = categoryId === "other" 
        ? !['coffee', 'tea', 'smoothie', 'beverage'].includes(product.categoryId)
        : product.categoryId === categoryId
      return matchesSearch && matchesCategory
    })
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF6F0] dark:bg-[#EDE3D4]">
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-auto ml-20 lg:ml-64">
          <div className="max-w-7xl mx-auto px-3 lg:px-6 py-4 lg:py-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-3 lg:mb-6">
              <div>
                <h2 className="text-lg lg:text-3xl font-extrabold text-[#2A1A12] dark:text-[#4e3521] tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Quản lý Menu</h2>
                <p className="text-xs lg:text-sm font-semibold text-[#2A1A12] dark:text-[#4e3521] mt-0.5 lg:mt-1">{products?.length || 0} sản phẩm</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full lg:w-auto">
                <Button
                  onClick={() => {
                    setEditingProduct(undefined)
                    setIsFormOpen(true)
                  }}
                  className="w-full lg:w-auto bg-gradient-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#8E5522] hover:to-[#C47B3E] text-white shadow-lg"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Thêm món mới
                </Button>
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 lg:mb-6"
            >
              <div className="relative">
                <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 h-3.5 lg:h-4 w-3.5 lg:w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên món..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 lg:pl-10 text-xs lg:text-sm h-9 lg:h-10 font-semibold bg-white dark:bg-[#3A2416] dark:text-[#E8DCC8] border-[#E4D9C9] dark:border-[#4A3420] dark:placeholder:text-[#A89580]"
                />
              </div>
            </motion.div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-3 lg:mb-6 bg-white dark:bg-[#3A2416] border border-[#E4D9C9] dark:border-[#4A3420] p-0.5 lg:p-1 h-auto">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const count = getFilteredProducts(cat.id).length
                  return (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="flex flex-col lg:flex-row items-center justify-center gap-0.5 lg:gap-2 font-bold text-[9px] lg:text-sm text-[#2A1A12] dark:text-[#E8DCC8] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C47B3E] data-[state=active]:to-[#8E5522] data-[state=active]:text-white py-1.5 lg:py-3 px-1 lg:px-3 h-auto min-h-[44px] lg:min-h-[48px]"
                    >
                      <Icon className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" />
                      <span className="hidden sm:inline truncate">{cat.label}</span>
                      <span className="text-[8px] lg:text-xs opacity-70">({count})</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id}>
                  <ProductListAdmin
                    products={getFilteredProducts(cat.id)}
                    onEdit={(product) => {
                      setEditingProduct(product)
                      setIsFormOpen(true)
                    }}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>

      {/* Dialog Form with Animation */}
      <AnimatePresence>
        {isFormOpen && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-[95vw] lg:max-w-3xl max-h-[90vh] overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                  <MenuForm 
                    product={editingProduct} 
                    onSuccess={(action, name) => handleSuccess(action, name)}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
