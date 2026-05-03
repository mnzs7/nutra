import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { PackageSearch } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  skeletonCount?: number
  emptyMessage?: string
  emptyDescription?: string
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyMessage = 'Nenhum produto encontrado',
  emptyDescription = 'Tente ajustar os seus filtros ou pesquisa.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
          <PackageSearch className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      aria-label={`${products.length} produtos`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
