"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MenuCard } from "@/components/menu/menu-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Coffee, Leaf, IceCream, Droplets, MoreHorizontal } from "lucide-react"
import { type Product } from "@/lib/firestore-service"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase-client"

export default function Menu() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]
      setProducts(productsData.filter(p => p.available))
      setLoading(false)
    })

    return () => unsubscribeProducts()
  }, [])

  const categories = [
    { id: "all", label: "Tất cả", icon: Coffee },
    { id: "coffee", label: "Cà phê", icon: Coffee },
    { id: "tea", label: "Trà", icon: Leaf },
    { id: "smoothie", label: "Trà sữa", icon: IceCream },
    { id: "beverage", label: "Nước ngọt", icon: Droplets },
    { id: "other", label: "Khác", icon: MoreHorizontal },
  ]

  const getFilteredProducts = (categoryId: string) => {
    return products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true
      if (categoryId === "all") return matchesSearch
      const matchesCategory = categoryId === "other" 
        ? !['coffee', 'tea', 'smoothie', 'beverage'].includes(product.categoryId)
        : product.categoryId === categoryId
      return matchesSearch && matchesCategory
    })
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7EFE5] dark:bg-[#6f5e48] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center mb-4 sm:mb-8 px-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-[#3A2416] dark:text-[#FEF7ED] mb-2">Menu</h1>
              <p className="text-xs sm:text-base text-[#3A2416]/70 dark:text-[#FEF7ED]/70">Khám phá thực đơn đa dạng của chúng tôi</p>
            </div>

            <div className="relative px-4">
              <Search className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm món..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full min-h-11 text-base"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-4 sm:mb-6 px-2 sm:px-4">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-[#E4D9C9] dark:bg-[#d6c8bf] border border-[#E4D9C9] p-1 rounded-lg">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    const count = getFilteredProducts(cat.id).length
                    const isActive = activeTab === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md font-bold transition-all min-h-14 ${
                          isActive
                            ? "bg-[#6B4423] text-[#FEF7ED] shadow-md"
                            : "text-[#3A2416] hover:bg-[#3A2416]/10"
                        }`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[10px] sm:text-xs leading-tight text-center">{cat.label}</span>
                        <span className="text-[9px] opacity-70">({count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Coffee className="w-12 h-12 mx-auto mb-4 text-[#6B4423] animate-pulse" />
                  <p className="text-[#3A2416]/70">Đang tải menu...</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <TabsContent key={cat.id} value={cat.id}>
                    {getFilteredProducts(cat.id).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 px-2 sm:px-0">
                        {getFilteredProducts(cat.id).map((product, index) => (
                          <MenuCard key={product.id} product={product} index={index} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 px-4">
                        <p className="text-[#3A2416]/70 text-sm sm:text-base">Không có sản phẩm nào</p>
                      </div>
                    )}
                  </TabsContent>
                ))
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
