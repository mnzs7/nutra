'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/lib/hooks/useSearch'
import { formatPrice } from '@/lib/utils/formatPrice'
import { categories } from '@/lib/data/products'
import { cn } from '@/lib/utils/cn'

interface SearchBarProps {
  className?: string
  placeholder?: string
  onClose?: () => void
}

export function SearchBar({ className, placeholder = 'Buscar productos...', onClose }: SearchBarProps) {
  const router = useRouter()
  const { query, suggestions, isOpen, search, clearSearch, closeSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeSearch])

  const handleSuggestionClick = (slug: string) => {
    clearSearch()
    onClose?.()
    router.push(`/products/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      closeSearch()
      onClose?.()
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getCategoryLabel = (catId: string) => {
    return categories.find((c) => c.id === catId)?.label ?? catId
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="search-input" className="sr-only">
          Buscar productos
        </label>
        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm',
              'text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white',
              'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:bg-gray-800',
              'transition-all duration-200'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 p-0.5 rounded text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            id="search-suggestions"
            role="listbox"
            aria-label="Sugerencias de búsqueda"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full mt-2 w-full z-50',
              'rounded-xl border border-gray-200 bg-white shadow-xl',
              'dark:border-gray-700 dark:bg-gray-800',
              'overflow-hidden'
            )}
          >
            <ul>
              {suggestions.map((suggestion) => (
                <li key={suggestion.id} role="option" aria-selected="false">
                  <button
                    onClick={() => handleSuggestionClick(suggestion.slug)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3',
                      'hover:bg-gray-50 dark:hover:bg-gray-700',
                      'focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700',
                      'text-left transition-colors'
                    )}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={suggestion.image}
                        alt={suggestion.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {suggestion.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getCategoryLabel(suggestion.category)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary-600 shrink-0">
                      {formatPrice(suggestion.price)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* View all results */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-2">
              <button
                onClick={handleSubmit as unknown as React.MouseEventHandler}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2',
                  'text-sm text-primary-600 font-medium',
                  'hover:bg-primary-50 dark:hover:bg-primary-900/20',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-colors'
                )}
              >
                <span>Ver todos los resultados para &quot;{query}&quot;</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
