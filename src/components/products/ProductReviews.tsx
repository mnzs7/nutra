'use client'

import { useState } from 'react'
import { CheckCircle2, ThumbsUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Rating } from '@/components/ui/Rating'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Review } from '@/lib/types'

interface ProductReviewsProps {
  reviews: Review[]
  rating: number
  reviewsCount: number
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-5 border-b border-gray-100 dark:border-gray-700 last:border-0"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
            {review.author.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {review.author}
            </span>
            {review.verified && (
              <span className="flex items-center gap-0.5 text-xs text-primary-600 dark:text-primary-400">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Compra verificada
              </span>
            )}
            <time
              dateTime={review.date}
              className="text-xs text-gray-400 dark:text-gray-500 ml-auto"
            >
              {new Date(review.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <Rating value={review.rating} size="sm" className="mt-1" />
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        {review.title}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {review.body}
      </p>

      <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
        ¿Útil?
      </button>
    </motion.div>
  )
}

export function ProductReviews({
  reviews,
  rating,
  reviewsCount,
}: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
        : 0,
  }))

  return (
    <section aria-labelledby="reviews-heading">
      <h2
        id="reviews-heading"
        className="text-xl font-bold text-gray-900 dark:text-white mb-6"
      >
        Reseñas de Clientes
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-1">Sin reseñas aún</p>
          <p className="text-sm">¡Sé el primero en reseñar este producto!</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            {/* Overall rating */}
            <div className="flex flex-col items-center justify-center sm:pr-8 sm:border-r sm:border-gray-200 dark:sm:border-gray-700 shrink-0">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                {rating.toFixed(1)}
              </span>
              <Rating value={rating} size="lg" className="my-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {reviewsCount.toLocaleString('es-ES')} reseñas
              </span>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-2">
              {distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-8 shrink-0">
                    {star}★
                  </span>
                  <ProgressBar
                    value={percentage}
                    max={100}
                    size="sm"
                    className="flex-1"
                    animated={false}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right shrink-0">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div>
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                aria-expanded={showAll}
              >
                {showAll
                  ? 'Ver menos reseñas'
                  : `Ver las ${reviews.length} reseñas`}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
