'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/lib/types'

const MAX_COMPARE_ITEMS = 3

interface CompareStore {
  items: Product[]
  addItem: (product: Product) => boolean
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => boolean
  clearCompare: () => void
  isInCompare: (productId: string) => boolean
  isFull: () => boolean
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().isFull()) return false
        if (get().isInCompare(product.id)) return false

        set((state) => ({ items: [...state.items, product] }))
        return true
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      toggleItem: (product) => {
        const isInCompare = get().isInCompare(product.id)
        if (isInCompare) {
          get().removeItem(product.id)
          return false
        } else {
          return get().addItem(product)
        }
      },

      clearCompare: () => {
        set({ items: [] })
      },

      isInCompare: (productId) => {
        return get().items.some((item) => item.id === productId)
      },

      isFull: () => {
        return get().items.length >= MAX_COMPARE_ITEMS
      },
    }),
    {
      name: 'vitashop-compare',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
