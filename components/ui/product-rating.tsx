"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Rating {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  productId: string
  orderId: string
  rating: number
  comment?: string
  createdAt: Date
}

interface ProductRatingProps {
  productId: string
  orderId: string
  onSubmitRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void
  existingRating?: Rating
  readonly?: boolean
}

export function ProductRating({
  productId,
  orderId,
  onSubmitRating,
  existingRating,
  readonly = false
}: ProductRatingProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0)
  const [comment, setComment] = useState(existingRating?.comment || "")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmitRating({
        userId: "current-user", // This would come from auth context
        userName: "Khách hàng", // This would come from user profile
        productId,
        orderId,
        rating,
        comment: comment.trim() || undefined
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (readonly && existingRating) {
    return (
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={existingRating.userAvatar} />
            <AvatarFallback>{existingRating.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{existingRating.userName}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= existingRating.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {existingRating.comment && (
              <p className="text-sm text-muted-foreground">{existingRating.comment}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {existingRating.createdAt.toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-coffee-900">Đánh giá sản phẩm</h3>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Chất lượng sản phẩm</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "Tệ"}
              {rating === 2 && "Không hài lòng"}
              {rating === 3 && "Bình thường"}
              {rating === 4 && "Hài lòng"}
              {rating === 5 && "Tuyệt vời"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Nhận xét (tùy chọn)</label>
          </div>
          <Textarea
            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-coffee-700 hover:bg-coffee-900"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>
    </Card>
  )
}

interface ProductRatingSummaryProps {
  productId: string
  ratings: Rating[]
}

export function ProductRatingSummary({ productId, ratings }: ProductRatingSummaryProps) {
  const productRatings = ratings.filter(r => r.productId === productId)

  if (productRatings.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p className="text-muted-foreground">Chưa có đánh giá nào</p>
      </div>
    )
  }

  const averageRating = productRatings.reduce((sum, r) => sum + r.rating, 0) / productRatings.length
  const ratingCounts = [1, 2, 3, 4, 5].map(rating =>
    productRatings.filter(r => r.rating === rating).length
  )

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Overview */}
        <div className="text-center">
          <div className="text-4xl font-bold text-coffee-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {productRatings.length} đánh giá
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-3">{rating}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${(ratingCounts[rating - 1] / productRatings.length) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-6">
                {ratingCounts[rating - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      {productRatings.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-coffee-900">Đánh giá gần đây</h4>
          {productRatings.slice(0, 3).map((rating) => (
            <div key={rating.id} className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={rating.userAvatar} />
                  <AvatarFallback>{rating.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{rating.userName}</span>
                <div className="flex ml-auto">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= rating.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {rating.comment && (
                <p className="text-sm text-muted-foreground">{rating.comment}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {rating.createdAt.toLocaleDateString('vi-VN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
