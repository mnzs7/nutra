'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { products } from '@/lib/data/products'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductSort } from '@/components/products/ProductSort'
import type { ProductFilters as ProductFiltersType, SortOption, ProductCategory } from '@/lib/types'

const DEFAULT_FILTERS: ProductFiltersType = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 200,
  rating: 0,
  inStock: false,
  isNew: false,
  isBestSeller: false,
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ProductFiltersType>(() => {
    const cat = searchParams.get('category') as ProductCategory | null
    return {
      ...DEFAULT_FILTERS,
      categories: cat ? [cat] : [],
    }
  })
  const [sort, setSort] = useState<SortOption>('relevance')

  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory | null
    const q = searchParams.get('q')
    if (cat) {
      setFilters((f) => ({ ...f, categories: [cat] }))
    }
    if (q) {
      // handled in search
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    const query = searchParams.get('q')?.toLowerCase()

    let result = products.filter((p) => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false
      if (filters.rating > 0 && p.rating < filters.rating) return false
      if (filters.inStock && p.stock === 0) return false
      if (filters.isNew && !p.isNew) return false
      if (filters.isBestSeller && !p.isBestSeller) return false
      if (query) {
        const matchText = `${p.name} ${p.description} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase()
        if (!matchText.includes(query)) return false
      }
      return true
    })

    switch (sort) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'rating_desc':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result = [...result].sort((a) => (a.isNew ? -1 : 1))
        break
      case 'bestseller':
        result = [...result].sort((a) => (a.isBestSeller ? -1 : 1))
        break
      default:
        result = [...result].sort((a) => (a.isFeatured ? -1 : 1))
    }

    return result
  }, [filters, sort, searchParams])

  const query = searchParams.get('q')

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          {query ? `Resultados para "${query}"` : 'Todos los Productos'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          productCount={filtered.length}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="lg:hidden text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
            </div>
            <div className="ml-auto">
              <ProductSort value={sort} onChange={setSort} />
            </div>
          </div>

          <ProductGrid
            products={filtered}
            emptyMessage="Ningún producto encontrado"
            emptyDescription="Intenta ajustar los filtros o limpia la búsqueda para ver más resultados."
          />
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
