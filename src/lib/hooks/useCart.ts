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
      toast.error('Producto agotado', 'Este producto no está disponible en este momento.')
      return
    }

    cart.addItem(product, quantity, subscription)

    const message =
      subscription === 'monthly'
        ? `${product.name} añadido con suscripción mensual (15% descuento)`
        : `${product.name} añadido al carrito`

    toast.success('¡Añadido al carrito!', message)
  }

  const removeFromCart = (product: Product) => {
    cart.removeItem(product.id)
    toast.info('Producto eliminado', `${product.name} eliminado del carrito`)
  }

  const checkout = (total: number) => {
    const earnedPoints = calculatePoints(total)
    points.addPoints(earnedPoints, `Compra completada - ${new Date().toLocaleDateString('es-ES')}`)
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
