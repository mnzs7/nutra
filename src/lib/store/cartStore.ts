'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getSubscriptionPrice } from '@/lib/utils/formatPrice'
import type { CartItem, CartItemSubscription, Product } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  couponCode: string | undefined
  discount: number
  pointsApplied: number

  // Actions
  addItem: (product: Product, quantity?: number, subscription?: CartItemSubscription) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateSubscription: (productId: string, subscription: CartItemSubscription) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  applyPoints: (points: number) => void
  removePoints: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getShippingCost: () => number
  getTotal: () => number
  getDiscountAmount: () => number
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}

const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 4.99

const VALID_COUPONS: Record<string, number> = {
  VITA10: 0.1,
  SAVE15: 0.15,
  WELCOME20: 0.2,
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: undefined,
      discount: 0,
      pointsApplied: 0,

      addItem: (product, quantity = 1, subscription = 'once') => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.subscription === subscription
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.subscription === subscription
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity, subscription }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      updateSubscription: (productId, subscription) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, subscription } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], couponCode: undefined, discount: 0, pointsApplied: 0 })
      },

      applyCoupon: (code) => {
        const upperCode = code.toUpperCase()
        const discount = VALID_COUPONS[upperCode]
        if (discount) {
          set({ couponCode: upperCode, discount })
          return true
        }
        return false
      },

      removeCoupon: () => {
        set({ couponCode: undefined, discount: 0 })
      },

      applyPoints: (points) => {
        set({ pointsApplied: points })
      },

      removePoints: () => {
        set({ pointsApplied: 0 })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price =
            item.subscription === 'monthly'
              ? getSubscriptionPrice(item.product.price)
              : item.product.price
          return total + price * item.quantity
        }, 0)
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal()
        const couponDiscount = subtotal * get().discount
        const pointsDiscount = get().pointsApplied / 100
        return Math.round((couponDiscount + pointsDiscount) * 100) / 100
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShippingCost()
        const discountAmount = get().getDiscountAmount()
        return Math.max(0, Math.round((subtotal + shipping - discountAmount) * 100) / 100)
      },

      isInCart: (productId) => {
        return get().items.some((item) => item.product.id === productId)
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.product.id === productId)
        return item?.quantity ?? 0
      },
    }),
    {
      name: 'vitashop-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
        pointsApplied: state.pointsApplied,
      }),
    }
  )
)
