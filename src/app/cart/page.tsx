'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Seguir Comprando
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              Carrito de Compras
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5" aria-live="polite">
              {items.length === 0
                ? 'Tu carrito está vacío'
                : `${items.reduce((a, i) => a + i.quantity, 0)} ${items.length === 1 ? 'producto' : 'productos'}`}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Vaciar todo el carrito"
            >
              Vaciar carrito
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Añade productos al carrito para continuar. Explora nuestra selección de
              suplementos premium.
            </p>
            <Link href="/products">
              <Button size="lg" leftIcon={<ShoppingCart className="h-5 w-5" />}>
                Explorar Productos
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="sr-only">Artículos en el carrito</h2>
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem key={`${item.product.id}-${item.subscription}`} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
