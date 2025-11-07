"use client"

import type React from "react"

import { useState } from "react"
import { addProduct, updateProduct } from "@/lib/firestore-service"
import type { Product } from "@/lib/firestore-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Plus, X, Upload, Coffee, DollarSign, Tag } from "lucide-react"
import { deleteFromCloudinary } from "@/lib/cloudinary-service"
import Image from "next/image"
import { getVietnamTimestamp } from "@/lib/date-utils"

interface MenuFormProps {
  product?: Product
  onSuccess: (action: "add" | "update", name: string) => void
  onCancel?: () => void
}

const CATEGORIES = [
  { value: "coffee", label: "Cà Phê" },
  { value: "tea", label: "Trà" },
  { value: "smoothie", label: "Trà Sữa" },
  { value: "beverage", label: "Nước Ngọt" },
]

export function MenuForm({ product, onSuccess, onCancel }: MenuFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price.toString() || "")
  const [category, setCategory] = useState(product?.categoryId || "coffee")
  const [available, setAvailable] = useState(product?.available ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Extended product fields
  const [basePrice, setBasePrice] = useState(product?.price?.toString() || "")
  const [variants, setVariants] = useState(product?.variants || [])
  const [types, setTypes] = useState<string[]>(
    product?.types ? product.types.split(',').map(t => t.trim()).slice(0, 3) : ['', '', '']
  )
  const [images, setImages] = useState<string[]>(product?.images || [product?.imageUrl || ""])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  // Variant management
  const addVariant = () => {
    setVariants([...variants, { name: "", priceDiff: 0 }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: string | number) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }



  // Image upload handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      setError("Chỉ được tải tối đa 5 ảnh")
      return
    }
    
    setImageFiles([...imageFiles, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const handleImageUpload = async () => {
    const existingUrls = images.filter(img => img && img.startsWith('http'))
    
    if (imageFiles.length === 0) return existingUrls.length > 0 ? existingUrls : null

    setUploadingImage(true)
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) throw new Error('Upload failed')
        const result = await response.json()
        return result.secure_url
      })
      const uploadedUrls = await Promise.all(uploadPromises)
      return [...existingUrls, ...uploadedUrls]
    } catch (error) {
      console.error("Upload failed:", error)
      const errorMsg = error instanceof Error ? error.message : "Lỗi khi tải ảnh lên"
      setError(errorMsg)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!name.trim() || !description.trim() || !price) {
        throw new Error("Vui lòng điền đầy đủ thông tin")
      }

      // Upload images if selected
      const uploadedImages = await handleImageUpload()
      if (!uploadedImages) return // Upload failed, stop submission

      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number.parseFloat(price),
        categoryId: category,
        available,
        variants,
        types: types.filter(t => t.trim()).join(', '),
        imageUrl: uploadedImages[0] || "",
        images: uploadedImages,
        createdAt: product?.createdAt || getVietnamTimestamp(),
        updatedAt: getVietnamTimestamp(),
      }

      if (product) {
        await updateProduct(product.id, productData)
      } else {
        await addProduct(productData)
      }

      setName("")
      setDescription("")
      setPrice("")
      setCategory("coffee")
      setAvailable(true)
      setBasePrice("")
      setVariants([])
      setTypes(['', '', ''])
      setImages([])
      setImageFiles([])
      onSuccess(product ? "update" : "add", name.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white dark:bg-[#3A2C20] border-[#E8DCC8] dark:border-[#6B4423]">
        <div className="flex items-center gap-2 mb-6">
          <Coffee className="h-5 w-5 text-[#6B4423] dark:text-[#E8DCC8]" />
          <h3 className="text-xl font-semibold text-[#2A1A12] dark:text-[#FFF9F0]">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tên sản phẩm
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Cà phê đen nóng"
                  required
                  className="bg-white dark:bg-[#2A1A12] text-[#2A1A12] dark:text-[#FFF9F0] border-[#E8DCC8] dark:border-[#6B4423]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Giá cơ bản (đ)
                </label>
                <Input
                  type="number"
                  value={basePrice || price}
                  onChange={(e) => {
                    setBasePrice(e.target.value)
                    setPrice(e.target.value)
                  }}
                  placeholder="12000"
                  min="0"
                  required
                  className="bg-white dark:bg-[#2A1A12] text-[#2A1A12] dark:text-[#FFF9F0] border-[#E8DCC8] dark:border-[#6B4423]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] mb-2">Mô tả</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về sản phẩm"
                required
                rows={3}
                className="bg-white dark:bg-[#2A1A12] text-[#2A1A12] dark:text-[#FFF9F0] border-[#E8DCC8] dark:border-[#6B4423]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] mb-2">Danh mục</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white dark:bg-[#2A1A12] text-[#2A1A12] dark:text-[#FFF9F0] border-[#E8DCC8] dark:border-[#6B4423]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-bold text-[#2A1A12] dark:text-[#FFF9F0] mb-2">Trạng thái</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-[#6B4423] focus:ring-[#6B4423]"
                    />
                    <span className="text-sm font-semibold text-[#2A1A12] dark:text-[#FFF9F0]">Có sẵn</span>
                  </label>
                  <Badge variant={available ? "default" : "secondary"} className="text-xs">
                    {available ? "Đang bán" : "Tạm ngừng"}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Variants Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-t pt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-[#2A1A12] dark:text-[#FFF9F0]">Biến thể (Size)</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm size
              </Button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 border border-[#E8DCC8] dark:border-[#6B4423] rounded-lg bg-[#F5EFE7] dark:bg-[#2A1A12]"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Tên size (Lớn, Vừa, Nhỏ)"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, "name", e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Phụ phí (đ)"
                      value={variant.priceDiff}
                      onChange={(e) => updateVariant(index, "priceDiff", parseInt(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Upload Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-t pt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#6B4423] dark:text-[#E8DCC8]" />
                <h4 className="text-lg font-bold text-[#2A1A12] dark:text-[#FFF9F0]">Ảnh sản phẩm</h4>
              </div>
              <span className="text-sm text-muted-foreground">{images.filter(img => img).length}/5 ảnh</span>
            </div>

            <div className="space-y-4">
              {images.filter(img => img).length < 5 && (
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#6B4423] dark:border-[#E8DCC8] rounded-lg cursor-pointer hover:bg-[#F5EFE7] dark:hover:bg-[#3A2C20] transition-colors"
                  >
                    <Upload className="h-4 w-4 text-[#6B4423] dark:text-[#E8DCC8]" />
                    <span className="text-sm font-semibold text-[#2A1A12] dark:text-[#FFF9F0]">Chọn ảnh (tối đa 5)</span>
                  </label>
                  {uploadingImage && (
                    <span className="text-sm font-semibold text-[#6B4423] dark:text-[#E8DCC8]">Đang tải lên...</span>
                  )}
                </div>
              )}

              {images.filter(img => img).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.filter(img => img).map((img, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={img}
                        alt={`Preview ${index + 1}`}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover border w-full h-32"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Types Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border-t pt-6"
          >
            <div className="mb-4">
              <h4 className="text-lg font-bold text-[#2A1A12] dark:text-[#FFF9F0] mb-2">Tùy chọn</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[0, 1, 2].map((index) => (
                  <Input
                    key={index}
                    placeholder={`Tùy chọn ${index + 1}`}
                    value={types[index] || ''}
                    onChange={(e) => {
                      const newTypes = [...types]
                      newTypes[index] = e.target.value
                      setTypes(newTypes)
                    }}
                    className="text-sm"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ví dụ: Nóng, Đá, Lạnh</p>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t pt-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4"
              >
                <Card className="p-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <p className="text-sm text-destructive">{error}</p>
                </Card>
              </motion.div>
            )}

            <div className="flex gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  Hủy
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#8E5522] hover:to-[#C47B3E] text-white"
              >
                {loading ? "Đang lưu..." : product ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  )
}
