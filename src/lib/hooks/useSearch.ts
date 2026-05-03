'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { products } from '@/lib/data/products'
import type { SearchSuggestion } from '@/lib/types'

// Pre-compute lowercased search text once at module load
const searchIndex = products.map((p) => ({
  product: p,
  searchText: `${p.name} ${p.category} ${p.brand} ${p.tags.join(' ')}`.toLowerCase(),
}))

export function useSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const search = useCallback((value: string) => {
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const lower = value.toLowerCase()
      const results = searchIndex
        .filter(({ searchText }) => searchText.includes(lower))
        .slice(0, 5)
        .map(({ product: p }): SearchSuggestion => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          price: p.price,
          image: p.images[0],
        }))

      setSuggestions(results)
      setIsOpen(results.length > 0)
    }, 200)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    query,
    suggestions,
    isOpen,
    search,
    clearSearch,
    closeSearch,
    setIsOpen,
  }
}
