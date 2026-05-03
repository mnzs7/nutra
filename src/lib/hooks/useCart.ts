'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { useToastStore } from '@/lib/store/toastStore'
import { usePointsStore } from '@/lib/store/pointsStore'
import type { Product, CartItemSubscription } from '@/lib/types'
import { calculatePoints } from '@/lib/utils/formatPrice'

export function useCart() {
  const cart = useCartStore()
  const toast = useToastStore()
  const points = usePointsStore()

  const addToCart = (
    product: Product,
    quantity = 1,
    subscription: CartItemSubscription = 'once'
  ) => {
    if (product.stock === 0) {
      toast.error('Produto esgotado', 'Este produto não está disponível de momento.')
      return
    }

    cart.addItem(product, quantity, subscription)

    const message =
      subscription === 'monthly'
        ? `${product.name} adicionado com subscrição mensal (15% desconto)`
        : `${product.name} adicionado ao carrinho`

    toast.success('Adicionado ao carrinho!', message)
  }

  const removeFromCart = (product: Product) => {
    cart.removeItem(product.id)
    toast.info('Produto removido', `${product.name} removido do carrinho`)
  }

  const checkout = (total: number) => {
    const earnedPoints = calculatePoints(total)
    points.addPoints(earnedPoints, `Compra concluída - ${new Date().toLocaleDateString('pt-PT')}`)
    cart.clearCart()
    return earnedPoints
  }

  return {
    ...cart,
    addToCart,
    removeFromCart,
    checkout,
    itemCount: cart.getItemCount(),
    subtotal: cart.getSubtotal(),
    shippingCost: cart.getShippingCost(),
    total: cart.getTotal(),
    discountAmount: cart.getDiscountAmount(),
  }
}
