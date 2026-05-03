'use client'

import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SortOption } from '@/lib/types'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price_asc', label: 'Preço: crescente' },
  { value: 'price_desc', label: 'Preço: decrescente' },
  { value: 'rating_desc', label: 'Melhor avaliação' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'bestseller', label: 'Mais vendidos' },
]

interface ProductSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
  className?: string
}

export function ProductSort({ value, onChange, className }: ProductSortProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor="sort-select"
        className="text-sm text-gray-600 dark:text-gray-400 shrink-0 flex items-center gap-1"
      >
        <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={cn(
          'text-sm border border-gray-300 rounded-lg px-3 py-2',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'dark:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'transition-colors'
        )}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
