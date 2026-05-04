'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X, BarChart2, ShoppingCart, Star, Plus } from 'lucide-react'
import { useCompareStore } from '@/lib/store/compareStore'
import { useCart } from '@/lib/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatPrice'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/lib/types'

interface CompareFieldProps {
  label: string
  values: (string | React.ReactNode)[]
  highlightBest?: boolean
  type?: 'text' | 'number' | 'badge'
}

function CompareRow({ label, values }: { label: string; values: (string | React.ReactNode)[] }) {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-3 pr-4 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap w-32 sm:w-40">
        {label}
      </td>
      {values.map((value, i) => (
        <td key={i} className="py-3 px-4 text-sm text-gray-900 dark:text-white text-center">
          {value || <span className="text-gray-300 dark:text-gray-600">—</span>}
        </td>
      ))}
    </tr>
  )
}

export default function ComparePage() {
  const { items, removeItem, clearCompare } = useCompareStore()
  const { addToCart } = useCart()

  const productCount = items.length
  const emptySlots = Math.max(0, 3 - productCount)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto">
            <BarChart2 className="h-10 w-10 text-gray-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            Comparador de Productos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Añade hasta 3 productos para comparar sus características lado a lado.
            Usa el botón de comparar en las páginas de producto.
          </p>
          <Link href="/products">
            <Button size="lg">Explorar Productos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Comparar Productos
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {items.length} de 3 productos seleccionados
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCompare}
            leftIcon={<X className="h-4 w-4" />}
          >
            Limpar
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-4 pr-4 text-left w-32 sm:w-40">
                  <span className="sr-only">Atributo</span>
                </th>

                {items.map((product) => (
                  <th key={product.id} className="py-4 px-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all"
                        aria-label={`Eliminar ${product.name} del comparador`}
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>

                      <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                        {product.brand}
                      </p>
                    </div>
                  </th>
                ))}

                {/* Empty slots */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <th key={`empty-${i}`} className="py-4 px-4 text-center">
                    <div className="mx-auto h-20 w-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                    </div>
                    <Link href="/products" className="text-sm text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                      Añadir producto
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="p-4">
              {/* Price */}
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-primary-50 dark:bg-primary-900/10">
                <td className="py-3 pr-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Precio
                </td>
                {items.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-center">
                    <span className="text-lg font-black text-gray-900 dark:text-white">
                      {formatPrice(p.price)}
                    </span>
                    {p.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(p.originalPrice)}
                      </div>
                    )}
                  </td>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <td key={i} className="py-3 px-4 text-center text-gray-300 dark:text-gray-600">—</td>
                ))}
              </tr>

              <CompareRow
                label="Valoración"
                values={items.map((p) => (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-bold text-amber-500">{p.rating}⭐</span>
                    <span className="text-xs text-gray-400">({p.reviewsCount})</span>
                  </div>
                ))}
              />

              <CompareRow
                label="Categoría"
                values={items.map((p) => (
                  <Badge variant="default" className="capitalize">{p.category}</Badge>
                ))}
              />

              <CompareRow
                label="Marca"

                values={items.map((p) => p.brand)}
              />

              <CompareRow
                label="Peso"
                values={items.map((p) => p.weight)}
              />

              <CompareRow
                label="Dosis"
                values={items.map((p) => `${p.servings} dosis`)}
              />

              <CompareRow
                label="Por dosis"
                values={items.map((p) => p.servingSize)}
              />

              <CompareRow
                label="Stock"
                values={items.map((p) => (
                  p.stock > 0
                    ? <span className="text-primary-600 font-medium">{p.stock} ud.</span>
                    : <Badge variant="danger">Agotado</Badge>
                ))}
              />

              <CompareRow
                label="Suscripción"
                values={items.map((p) => (
                  p.subscriptionAvailable
                    ? <Badge variant="success">Disponible (-15%)</Badge>
                    : <span className="text-gray-400">—</span>
                ))}
              />

              <CompareRow
                label="Novedad"
                values={items.map((p) => (
                  p.isNew ? <Badge variant="info">Nuevo</Badge> : '—'
                ))}
              />

              <CompareRow
                label="Más Vendido"
                values={items.map((p) => (
                  p.isBestSeller ? <Badge variant="warning">Sí</Badge> : '—'
                ))}
              />

              {/* Nutrition comparison - show first 3 facts */}
              {items[0]?.nutritionFacts.slice(0, 4).map((fact, fi) => (
                <CompareRow
                  key={fi}
                  label={fact.name.length > 20 ? fact.name.slice(0, 20) + '…' : fact.name}
                  values={items.map((p) => p.nutritionFacts[fi]?.amount || '—')}
                />
              ))}

              {/* CTA Row */}
              <tr>
                <td className="py-4 pr-4" />
                {items.map((p) => (
                  <td key={p.id} className="py-4 px-4 text-center">
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0}
                      leftIcon={<ShoppingCart className="h-4 w-4" aria-hidden="true" />}
                    >
                      {p.stock === 0 ? 'Agotado' : 'Añadir'}
                    </Button>
                  </td>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <td key={i} className="py-4 px-4" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
