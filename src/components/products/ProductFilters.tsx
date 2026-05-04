'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories } from '@/lib/data/products'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { ProductFilters, ProductCategory, ProductBrand } from '@/lib/types'

const brands: ProductBrand[] = [
  'VitaMax',
  'NutriPure',
  'SportLab',
  'NaturaBio',
  'PowerFit',
  'WellnessPlus',
]

const ratingOptions = [4, 3, 2, 1]

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  productCount?: number
}

const defaultFilters: ProductFilters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 200,
  rating: 0,
  inStock: false,
  isNew: false,
  isBestSeller: false,
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        aria-expanded={isOpen}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProductFilters({
  filters,
  onFiltersChange,
  productCount,
}: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200 ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.isNew ||
    filters.isBestSeller

  const toggleCategory = (category: ProductCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const toggleBrand = (brand: ProductBrand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const resetFilters = () => {
    onFiltersChange(defaultFilters)
  }

  const FilterContent = () => (
    <div className="space-y-0">
      {/* Categories */}
      <FilterSection title="Categorías">
        <fieldset>
          <legend className="sr-only">Filtrar por categoría</legend>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Marcas">
        <fieldset>
          <legend className="sr-only">Filtrar por marca</legend>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Precio">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label
                htmlFor="min-price"
                className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
              >
                Mínimo
              </label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                <input
                  id="min-price"
                  type="number"
                  min={0}
                  max={filters.maxPrice}
                  value={filters.minPrice}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minPrice: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label
                htmlFor="max-price"
                className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
              >
                Máximo
              </label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
                <input
                  id="max-price"
                  type="number"
                  min={filters.minPrice}
                  max={500}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxPrice: Number(e.target.value),
                    })
                  }
                  className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Valoración Mínima">
        <fieldset>
          <legend className="sr-only">Filtrar por valoración</legend>
          <div className="space-y-2">
            {ratingOptions.map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() =>
                    onFiltersChange({
                      ...filters,
                      rating: filters.rating === rating ? 0 : rating,
                    })
                  }
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
                  {'★'.repeat(rating)}
                  {'☆'.repeat(5 - rating)}
                  <span className="text-gray-500 dark:text-gray-400">o más</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </FilterSection>

      {/* Other Filters */}
      <FilterSection title="Otros Filtros" defaultOpen={false}>
        <fieldset>
          <legend className="sr-only">Otros filtros</legend>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                Solo en stock
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.isNew}
                onChange={(e) => onFiltersChange({ ...filters, isNew: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                Novedades
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.isBestSeller}
                onChange={(e) =>
                  onFiltersChange({ ...filters, isBestSeller: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                Más Vendidos
              </span>
            </label>
          </div>
        </fieldset>
      </FilterSection>

      {/* Reset */}
      {hasActiveFilters && (
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={resetFilters}
            leftIcon={<X className="h-3.5 w-3.5" />}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        >
          Filtros {hasActiveFilters && <span className="ml-1 text-primary-600">•</span>}

        </Button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white dark:bg-gray-900 overflow-y-auto p-5 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filtros de productos"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filtros
                  </h2>
                  {productCount !== undefined && (
                    <p className="text-sm text-gray-500">{productCount} productos</p>
                  )}
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Cerrar filtros"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <FilterContent />
              <div className="mt-4">
                <Button fullWidth onClick={() => setMobileOpen(false)}>
                  Ver {productCount ?? ''} resultados
                </Button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-64 shrink-0"
        aria-label="Filtros de productos"
      >
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Filtros
            </h2>
            {productCount !== undefined && (
              <span className="text-sm text-gray-500">({productCount})</span>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>
    </>
  )
}
