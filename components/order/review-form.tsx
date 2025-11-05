"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase-client"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface ReviewFormProps {
  orderId: string
  user: any
  onSuccess?: () => void
}

export function ReviewForm({ orderId, user, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét")
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.id,
        userName: user.name || user.phone,
        orderId,
        rating,
        comment: comment.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      await updateDoc(doc(db, "orders", orderId), {
        reviewed: true
      })

      toast.success("✅ Cảm ơn bạn đã đánh giá!")
      setComment("")
      setRating(5)
      onSuccess?.()
    } catch (error) {
      toast.error("❌ Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-[#3A2C20] dark:text-[#FAF6F0]">
          Đánh giá của bạn
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-all ${
                  star <= (hoveredStar || rating)
                    ? "fill-[#C47B3E] text-[#C47B3E]"
                    : "text-[#D4C4B0]"
                }`}
              />
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-[#8B6F47]">
          {rating === 5 ? "Tuyệt vời!" : rating === 4 ? "Rất tốt!" : rating === 3 ? "Tốt" : rating === 2 ? "Bình thường" : "Cần cải thiện"}
        </p>
      </div>

      <Textarea
        placeholder="Chia sẻ cảm nhận của bạn về đồ uống và dịch vụ..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px] bg-[#FAF6F0] dark:bg-[#2A1A12] border-[#D4C4B0] focus:border-[#C47B3E] focus:ring-[#C47B3E] resize-none"
        disabled={loading}
      />

      <Button
        type="submit"
        disabled={loading || !comment.trim()}
        className="w-full bg-gradient-to-r from-[#C47B3E] to-[#8E5522] hover:from-[#D58A4A] hover:to-[#9F6633] text-white font-semibold"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    </motion.form>
  )
}
