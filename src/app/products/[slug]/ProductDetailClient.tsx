'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  BarChart2,
  RefreshCw,
  ChevronRight,
  Share2,
  Package,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { useCompareStore } from '@/lib/store/compareStore'
import { useToastStore } from '@/lib/store/toastStore'
import { formatPrice, getSubscriptionPrice } from '@/lib/utils/formatPrice'
import { ProductGallery } from '@/components/products/ProductGallery'
import { NutritionFacts } from '@/components/products/NutritionFacts'
import { ProductReviews } from '@/components/products/ProductReviews'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils/cn'
import { categories } from '@/lib/data/products'
import type { Product, CartItemSubscription } from '@/lib/types'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

type TabType = 'description' | 'nutrition' | 'ingredients' | 'reviews'

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [subscription, setSubscription] = useState<CartItemSubscription>('once')
  const [activeTab, setActiveTab] = useState<TabType>('description')

  const { addToCart, isInCart } = useCart()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { toggleItem: toggleCompare, isInCompare, isFull } = useCompareStore()
  const toast = useToastStore()

  const inCart = isInCart(product.id)
  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const stockPercent = (product.stock / 200) * 100
  const isLowStock = product.stock > 0 && product.stock <= 15

  const currentPrice = subscription === 'monthly' ? getSubscriptionPrice(product.price) : product.price
  const categoryMeta = categories.find((c) => c.id === product.category)

  const handleAddToCart = () => {
    addToCart(product, quantity, subscription)
  }

  const handleWishlist = () => {
    const added = toggleItem(product)
    toast[added ? 'success' : 'info'](
      added ? 'Añadido a favoritos' : 'Eliminado de favoritos',
      product.name
    )
  }

  const handleCompare = () => {
    if (!inCompare && isFull()) {
      toast.warning('Límite alcanzado', 'Máximo 3 productos en el comparador')
      return
    }
    const added = toggleCompare(product)
    toast.info(
      added ? 'Añadido al comparador' : 'Eliminado del comparador',
      product.name
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('¡Enlace copiado!', 'El enlace del producto se ha copiado al portapapeles')
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'description', label: 'Descripción' },
    { id: 'nutrition', label: 'Nutrición' },
    { id: 'ingredients', label: 'Ingredientes' },
    { id: 'reviews', label: `Reseñas (${product.reviewsCount.toLocaleString()})` },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Ubicación actual" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                Inicio
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <li>
              <Link href="/products" className="hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                Productos
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <li>
              <Link href={`/products?category=${product.category}`} className="hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                {categoryMeta?.label ?? product.category}
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <li aria-current="page" className="text-gray-900 dark:text-white font-medium truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isBestSeller && <Badge variant="warning">Más Vendido</Badge>}
              {product.isNew && <Badge variant="info">Nuevo</Badge>}
              {product.stock === 0 && <Badge variant="danger">Agotado</Badge>}
              {isLowStock && <Badge variant="warning">Últimas {product.stock} unidades</Badge>}
            </div>

            {/* Brand + Name */}
            <div>
              <Link
                href={`/products?brand=${product.brand}`}
                className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide hover:underline"
              >
                {product.brand}
              </Link>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Rating
                value={product.rating}
                showValue
                count={product.reviewsCount}
                size="md"
              />
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                Ver reseñas
              </button>
            </div>

            {/* Short description */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Benefits */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Principales beneficios:
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-primary-600 shrink-0" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscription Toggle */}
            {product.subscriptionAvailable && (
              <div
                className="rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
                role="group"
                aria-label="Frecuencia de compra"
              >
                <div className="grid grid-cols-2">
                  <button
                    onClick={() => setSubscription('once')}
                    className={cn(
                      'px-4 py-3 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                      subscription === 'once'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                    aria-pressed={subscription === 'once'}
                  >
                    Compra Única
                    <div className="text-xs mt-0.5 opacity-80">
                      {formatPrice(product.price)}
                    </div>
                  </button>
                  <button
                    onClick={() => setSubscription('monthly')}
                    className={cn(
                      'px-4 py-3 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 relative',
                      subscription === 'monthly'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                    aria-pressed={subscription === 'monthly'}
                  >
                    <span className="absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-900 font-bold">
                      -15%
                    </span>
                    Suscripción Mensual
                    <div className="text-xs mt-0.5 opacity-80">
                      {formatPrice(getSubscriptionPrice(product.price))}/mes
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {formatPrice(currentPrice)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="danger">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Cantidad:
              </label>
              <div
                className="flex items-center rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden"
                role="group"
                aria-label="Seleccionar cantidad"
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 transition-colors text-gray-700 dark:text-gray-200"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="w-12 text-center text-sm font-medium border-x border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 py-2"
                  aria-label="Cantidad"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-10 w-10 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
              </span>
            </div>

            {/* Stock Bar */}
            {isLowStock && (
              <div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  ¡Atención: solo {product.stock} unidades en stock!
                </p>
                <ProgressBar
                  value={product.stock}
                  max={50}
                  color="warning"
                  size="sm"
                  animated={false}
                />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                leftIcon={<ShoppingCart className="h-5 w-5" aria-hidden="true" />}
              >
                {product.stock === 0
                  ? 'Agotado'
                  : inCart
                  ? 'Añadido al Carrito'
                  : 'Añadir al Carrito'}
              </Button>

              <div className="flex gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlist}
                  aria-pressed={inWishlist}
                  aria-label={inWishlist ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                  className={cn(inWishlist && 'border-red-300 text-red-500 hover:border-red-400')}
                >
                  <Heart
                    className={cn('h-5 w-5', inWishlist && 'fill-red-500 text-red-500')}
                    aria-hidden="true"
                  />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleCompare}
                  aria-pressed={inCompare}
                  aria-label={inCompare ? 'Eliminar del comparador' : 'Añadir al comparador'}
                  className={cn(inCompare && 'border-blue-300 text-blue-500 hover:border-blue-400')}
                >
                  <BarChart2 className="h-5 w-5" aria-hidden="true" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleShare}
                  aria-label="Compartir producto"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Points info */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
              <span className="text-base" aria-hidden="true">🏆</span>
              <span>
                Gana{' '}
                <strong className="text-amber-700 dark:text-amber-400">
                  +{Math.floor(currentPrice * quantity)} puntos
                </strong>{' '}
                con esta compra
              </span>
            </div>

            {/* Product Meta */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" aria-hidden="true" />
                SKU: {product.sku}
              </span>
              <span>Peso: {product.weight}</span>
              <span>{product.servings} dosis ({product.servingSize})</span>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div
            className="border-b border-gray-200 dark:border-gray-700 mb-6"
            role="tablist"
            aria-label="Información del producto"
          >
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          <div>
            {activeTab === 'description' && (
              <div
                id="tabpanel-description"
                role="tabpanel"
                aria-labelledby="tab-description"
                className="max-w-3xl"
              >
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
                  {product.longDescription}
                </p>

                {/* Warnings */}
                {product.warnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      Avisos importantes
                    </h3>
                    <ul className="space-y-1">
                      {product.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                          <span className="shrink-0 mt-1" aria-hidden="true">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div
                id="tabpanel-nutrition"
                role="tabpanel"
                aria-labelledby="tab-nutrition"
              >
                <NutritionFacts
                  facts={product.nutritionFacts}
                  servingSize={product.servingSize}
                  servings={product.servings}
                />
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div
                id="tabpanel-ingredients"
                role="tabpanel"
                aria-labelledby="tab-ingredients"
                className="max-w-2xl"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Lista de Ingredientes
                </h3>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                  {product.ingredients.join(', ')}.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div
                id="tabpanel-reviews"
                role="tabpanel"
                aria-labelledby="tab-reviews"
              >
                <ProductReviews
                  reviews={product.reviews}
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-2xl font-black text-gray-900 dark:text-white mb-6"
            >
              Productos Relacionados
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  )
}
