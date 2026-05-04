'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, BarChart2, Eye, Zap } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { useCompareStore } from '@/lib/store/compareStore'
import { useToastStore } from '@/lib/store/toastStore'
import { formatPrice, getSubscriptionPrice, calculateDiscountPercent } from '@/lib/utils/formatPrice'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  className?: string
}

function getAddToCartLabel(name: string, stock: number, inCart: boolean): string {
  if (stock === 0) return `${name} - Agotado`
  if (inCart) return `${name} ya está en el carrito`
  return `Añadir ${name} al carrito`
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart, isInCart } = useCart()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { toggleItem: toggleCompare, isInCompare, isFull } = useCompareStore()
  const toast = useToastStore()

  const inWishlist = isInWishlist(product.id)
  const inCart = isInCart(product.id)
  const inCompare = isInCompare(product.id)
  const discount = product.originalPrice
    ? calculateDiscountPercent(product.originalPrice, product.price)
    : 0

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleItem(product)
    if (added) {
      toast.success('Añadido a favoritos', product.name)
    } else {
      toast.info('Eliminado de favoritos', product.name)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inCompare && isFull()) {
      toast.warning('Límite alcanzado', 'Solo puedes comparar hasta 3 productos. Elimina uno para añadir otro.')
      return
    }
    const added = toggleCompare(product)
    if (added) {
      toast.info('Añadido al comparador', `${product.name} - ve a /compare para verlo`)
    } else {
      toast.info('Eliminado del comparador', product.name)
    }
  }

  return (
    <motion.div
      className={cn(
        'group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800',
        'hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700',
        'transition-all duration-300',
        className
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
        aria-label={`Ver ${product.name}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="info" size="sm">
                Nuevo
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="warning" size="sm">
                Más Vendido
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="danger" size="sm">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Stock Warning */}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="warning" size="sm" className="flex items-center gap-1">
                <Zap className="h-3 w-3" aria-hidden="true" />
                Últimas unidades
              </Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="danger">Agotado</Badge>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              aria-label={inWishlist ? `Quitar ${product.name} de favoritos` : `Añadir ${product.name} a favoritos`}
              aria-pressed={inWishlist}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg shadow-md',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                'transition-all',
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
              )}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} aria-hidden="true" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCompare}
              aria-label={inCompare ? `Quitar ${product.name} del comparador` : `Añadir ${product.name} al comparador`}
              aria-pressed={inCompare}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg shadow-md',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                'transition-all',
                inCompare
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-500'
              )}
            >
              <BarChart2 className="h-4 w-4" aria-hidden="true" />
            </motion.button>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Link
                href={`/products/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Ver detalles de ${product.name}`}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg shadow-md',
                  'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300',
                  'hover:bg-primary-50 hover:text-primary-600',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-all'
                )}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1 uppercase tracking-wide">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-3">
            <Rating
              value={product.rating}
              showValue
              count={product.reviewsCount}
              size="sm"
            />
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-1.5 text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label={getAddToCartLabel(product.name, product.stock, inCart)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                'transition-all duration-200',
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                  : inCart
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-600 dark:hover:text-white'
              )}
            >
              <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
              {product.stock === 0 ? 'Agotado' : inCart ? 'En el carrito' : 'Añadir'}
            </motion.button>
          </div>

          {/* Subscription pill */}
          {product.subscriptionAvailable && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Suscripción:{' '}
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {formatPrice(getSubscriptionPrice(product.price))}/mes (-15%)
              </span>
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
