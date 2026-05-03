'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cartStore'
import { useToastStore } from '@/lib/store/toastStore'
import { formatPrice, getSubscriptionPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'
import type { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, updateSubscription } = useCartStore()
  const toast = useToastStore()

  const { product, quantity, subscription } = item
  const unitPrice = subscription === 'monthly' ? getSubscriptionPrice(product.price) : product.price
  const totalPrice = unitPrice * quantity

  const handleRemove = () => {
    removeItem(product.id)
    toast.info('Produto removido', `${product.name} removido do carrinho`)
  }

  const handleDecrement = () => {
    if (quantity <= 1) {
      handleRemove()
      return
    }
    updateQuantity(product.id, quantity - 1)
  }

  const handleIncrement = () => {
    if (quantity >= product.stock) {
      toast.warning('Stock insuficiente', `Apenas ${product.stock} unidades disponíveis`)
      return
    }
    updateQuantity(product.id, quantity + 1)
  }

  const toggleSubscription = () => {
    const newSub = subscription === 'monthly' ? 'once' : 'monthly'
    updateSubscription(product.id, newSub)
    toast.info(
      newSub === 'monthly' ? 'Subscrição ativada' : 'Subscrição desativada',
      newSub === 'monthly'
        ? '15% de desconto ativado para este produto'
        : 'Compra única selecionada'
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {product.brand}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              {product.name}
            </Link>
          </div>
          <button
            onClick={handleRemove}
            aria-label={`Remover ${product.name} do carrinho`}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Subscription toggle */}
        {product.subscriptionAvailable && (
          <button
            onClick={toggleSubscription}
            className={cn(
              'mt-1.5 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'transition-all',
              subscription === 'monthly'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600'
            )}
            aria-pressed={subscription === 'monthly'}
          >
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            {subscription === 'monthly' ? 'Subscrição mensal (-15%)' : 'Compra única - ativar subscrição?'}
          </button>
        )}

        {/* Quantity + Price */}
        <div className="mt-2.5 flex items-center justify-between gap-3">
          {/* Quantity controls */}
          <div
            className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700"
            role="group"
            aria-label={`Quantidade de ${product.name}`}
          >
            <button
              onClick={handleDecrement}
              className="flex h-7 w-7 items-center justify-center rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3 w-3 text-gray-600 dark:text-gray-300" aria-hidden="true" />
            </button>
            <span
              className="min-w-[28px] text-center text-sm font-medium text-gray-900 dark:text-white"
              aria-live="polite"
              aria-label={`${quantity} unidades`}
            >
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              className="flex h-7 w-7 items-center justify-center rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3 w-3 text-gray-600 dark:text-gray-300" aria-hidden="true" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(totalPrice)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-gray-400">
                {formatPrice(unitPrice)} / un.
              </p>
            )}
            {subscription === 'monthly' && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(product.price * quantity)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
