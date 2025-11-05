"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Star, Trash2, Search, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const unsubReviews = onSnapshot(
      collection(db, "reviews"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setReviews(data.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
          return bTime.getTime() - aTime.getTime()
        }))
      },
      (error) => {
        console.error("Error fetching reviews:", error)
        setReviews([])
      }
    )

    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setMessages(data.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
          return bTime.getTime() - aTime.getTime()
        }))
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching messages:", error)
        setMessages([])
        setLoading(false)
      }
    )

    return () => {
      unsubReviews()
      unsubMessages()
    }
  }, [])

  const updateReviewStatus = async (reviewId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "reviews", reviewId), { 
        status: newStatus,
        updatedAt: new Date()
      })
      toast.success(newStatus === 'approved' ? "✅ Đã phê duyệt" : "👁️ Đã ẩn đánh giá")
    } catch (error) {
      toast.error("❌ Có lỗi xảy ra")
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Xóa vĩnh viễn đánh giá này?")) return
    try {
      await deleteDoc(doc(db, "reviews", reviewId))
      toast.success("🗑️ Đã xóa đánh giá")
    } catch (error) {
      toast.error("❌ Có lỗi xảy ra")
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Xóa tin nhắn này?")) return
    try {
      await deleteDoc(doc(db, "messages", messageId))
      toast.success("🗑️ Đã xóa tin nhắn")
    } catch (error) {
      toast.error("❌ Có lỗi xảy ra")
    }
  }

  const filteredReviews = reviews
    .filter(r => filter === "all" || r.status === filter)
    .filter(r => 
      r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const filteredMessages = messages.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone?.includes(searchTerm)
  )

  const stats = {
    total: reviews.length,
    avgRating: reviews.filter(r => r.rating).length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.filter(r => r.rating).length).toFixed(1)
      : "0.0",
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    messages: messages.length
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF6F0] dark:bg-[#2A1A12]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#C47B3E] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[#6B4423]">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#2A1A12]">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto ml-20 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-[#3A2C20] dark:text-[#FAF6F0] mb-2">
                Quản lý Đánh giá & Tin nhắn
              </h1>
              <p className="text-[#6B5A4A] dark:text-[#B8A99A] mb-6">
                Theo dõi phản hồi từ khách hàng và quản lý đánh giá sản phẩm
              </p>
            </motion.div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#C47B3E] to-[#8E5522] rounded-xl p-4 text-white shadow-lg cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Star className="w-8 h-8 mb-2" />
                </motion.div>
                <motion.p
                  key={stats.total}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {stats.total}
                </motion.p>
                <p className="text-xs opacity-90">Tổng đánh giá</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#F4A460] to-[#D2691E] rounded-xl p-4 text-white shadow-lg cursor-pointer"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-8 h-8 fill-yellow-300 text-yellow-300 mb-2" />
                </motion.div>
                <p className="text-2xl font-bold">⭐ {stats.avgRating}</p>
                <p className="text-xs opacity-90">Điểm trung bình</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#FFB347] to-[#FF8C00] rounded-xl p-4 text-white shadow-lg cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-8 h-8 mb-2" />
                </motion.div>
                <motion.p
                  key={stats.pending}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {stats.pending}
                </motion.p>
                <p className="text-xs opacity-90">Chờ duyệt</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#5C8A64] to-[#3d5a42] rounded-xl p-4 text-white shadow-lg cursor-pointer"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <CheckCircle className="w-8 h-8 mb-2" />
                </motion.div>
                <motion.p
                  key={stats.approved}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {stats.approved}
                </motion.p>
                <p className="text-xs opacity-90">Đã duyệt</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-[#8B6F47] to-[#6B4423] rounded-xl p-4 text-white shadow-lg cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageSquare className="w-8 h-8 mb-2" />
                </motion.div>
                <motion.p
                  key={stats.messages}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {stats.messages}
                </motion.p>
                <p className="text-xs opacity-90">Tin nhắn</p>
              </motion.div>
            </div>

            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-[#3A2C20] rounded-xl p-4 mb-6 shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8A99A]" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "pending", "approved", "hidden"].map(f => (
                    <Button
                      key={f}
                      size="sm"
                      variant={filter === f ? "default" : "outline"}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all" ? "Tất cả" : f === "pending" ? "Chờ" : f === "approved" ? "Duyệt" : "Ẩn"}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#C47B3E]" />
                Đánh giá ({filteredReviews.length})
              </h2>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                      className="bg-white dark:bg-[#3A2C20] rounded-xl p-4 border-l-4 border-[#C47B3E] cursor-pointer"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex-1" onClick={() => setSelectedReview(review)}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.userName}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <Badge>{review.status === "approved" ? "Đã duyệt" : review.status === "pending" ? "Chờ" : "Ẩn"}</Badge>
                          </div>
                          <p className="text-sm mb-2">{review.comment}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {review.status === "pending" && (
                            <Button size="sm" className="bg-[#5C8A64]" onClick={() => updateReviewStatus(review.id, "approved")}>
                              Duyệt
                            </Button>
                          )}
                          {review.status === "approved" && (
                            <Button size="sm" variant="outline" onClick={() => updateReviewStatus(review.id, "hidden")}>
                              <EyeOff className="w-4 h-4" />
                            </Button>
                          )}
                          {review.status === "hidden" && (
                            <Button size="sm" variant="outline" onClick={() => updateReviewStatus(review.id, "approved")}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteReview(review.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredReviews.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white dark:bg-[#3A2C20] rounded-xl"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-16 h-16 text-[#D4C4B0] mx-auto mb-4" />
                    </motion.div>
                    <p className="text-[#B8A99A]">Chưa có đánh giá nào</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#8B6F47]" />
                Tin nhắn ({filteredMessages.length})
              </h2>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredMessages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                      className="bg-white dark:bg-[#3A2C20] rounded-xl p-4 border-l-4 border-[#8B6F47] cursor-pointer"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex-1" onClick={() => setSelectedMessage(msg)}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{msg.name}</span>
                            <span className="text-sm text-muted-foreground">📞 {msg.phone}</span>
                          </div>
                          <p className="text-sm mb-2">{msg.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(msg.createdAt?.toDate?.() || msg.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMessage(msg.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredMessages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white dark:bg-[#3A2C20] rounded-xl"
                  >
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0], y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageSquare className="w-16 h-16 text-[#D4C4B0] mx-auto mb-4" />
                    </motion.div>
                    <p className="text-[#B8A99A]">Chưa có tin nhắn nào</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Review Detail Modal */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl bg-[#FAF6F0] dark:bg-[#3A2C20]">
          <DialogHeader>
            <DialogTitle className="text-[#3A2C20] dark:text-[#FAF6F0]">Chi tiết đánh giá</DialogTitle>
            <DialogDescription className="text-[#6B5A4A] dark:text-[#B8A99A]">
              Xem thông tin đầy đủ về đánh giá này
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C47B3E] to-[#8E5522] flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                >
                  {selectedReview.userName?.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <p className="font-bold text-lg text-[#3A2C20] dark:text-[#FAF6F0]">{selectedReview.userName}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star
                          className={`w-5 h-5 ${i < (selectedReview.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#F7EFE5] dark:bg-[#2A1A12] p-4 rounded-lg"
              >
                <p className="text-sm text-[#6B5A4A] dark:text-[#B8A99A] mb-2">Nội dung đánh giá</p>
                <p className="text-[#3A2C20] dark:text-[#FAF6F0] leading-relaxed">{selectedReview.comment}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pt-4 border-t border-[#D4C4B0]"
              >
                <p className="text-sm text-[#B8A99A]">
                  {new Date(selectedReview.createdAt?.toDate?.() || selectedReview.createdAt).toLocaleString("vi-VN")}
                </p>
                <Badge className={selectedReview.status === "approved" ? "bg-[#5C8A64]" : selectedReview.status === "pending" ? "bg-[#FFB347]" : "bg-[#B8A99A]"}>
                  {selectedReview.status === "approved" ? "Đã duyệt" : selectedReview.status === "pending" ? "Chờ duyệt" : "Đã ẩn"}
                </Badge>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Detail Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl bg-[#FAF6F0] dark:bg-[#3A2C20]">
          <DialogHeader>
            <DialogTitle className="text-[#3A2C20] dark:text-[#FAF6F0]">Chi tiết tin nhắn</DialogTitle>
            <DialogDescription className="text-[#6B5A4A] dark:text-[#B8A99A]">
              Xem thông tin đầy đủ về tin nhắn này
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6B4423] flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                >
                  {selectedMessage.name?.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <p className="font-bold text-lg text-[#3A2C20] dark:text-[#FAF6F0]">{selectedMessage.name}</p>
                  <p className="text-sm text-[#8B6F47] dark:text-[#D4C4B0]">📞 {selectedMessage.phone}</p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#F7EFE5] dark:bg-[#2A1A12] p-4 rounded-lg"
              >
                <p className="text-sm text-[#6B5A4A] dark:text-[#B8A99A] mb-2">Nội dung tin nhắn</p>
                <p className="text-[#3A2C20] dark:text-[#FAF6F0] leading-relaxed">{selectedMessage.message}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4 border-t border-[#D4C4B0]"
              >
                <p className="text-sm text-[#B8A99A]">
                  {new Date(selectedMessage.createdAt?.toDate?.() || selectedMessage.createdAt).toLocaleString("vi-VN")}
                </p>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
