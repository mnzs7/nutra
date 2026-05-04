'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Tag, Coins, X, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { usePointsStore } from '@/lib/store/pointsStore'
import { useToastStore } from '@/lib/store/toastStore'
import { formatPrice, pointsToEuro } from '@/lib/utils/formatPrice'
import { FreeShippingBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function CartSummary() {
  const cart = useCartStore()
  const points = usePointsStore()
  const toast = useToastStore()
  const [couponInput, setCouponInput] = useState('')
  const [appliedPoints, setAppliedPoints] = useState(0)

  const subtotal = cart.getSubtotal()
  const shippingCost = cart.getShippingCost()
  const discountAmount = cart.getDiscountAmount()
  const total = cart.getTotal()

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    const success = cart.applyCoupon(couponInput)
    if (success) {
      toast.success('¡Cupón aplicado!', `Descuento del ${Math.round(cart.discount * 100)}% añadido`)
      setCouponInput('')
    } else {
      toast.error('Cupón inválido', 'El código introducido no es válido o ha expirado')
    }
  }

  const handleApplyPoints = () => {
    if (points.balance < 100) {
      toast.warning('Puntos insuficientes', 'Necesitas al menos 100 puntos (€1) para usar')
      return
    }

    // Use all available points up to 50% of total
    const maxPointsToUse = Math.min(points.balance, Math.floor(total * 50))
    const roundedPoints = Math.floor(maxPointsToUse / 100) * 100 // Round to nearest 100

    if (roundedPoints === 0) {
      toast.warning('Puntos insuficientes', 'No tienes suficientes puntos para canjear')
      return
    }

    cart.applyPoints(roundedPoints)
    setAppliedPoints(roundedPoints)
    toast.success(
      `${roundedPoints} puntos aplicados`,
      `Descuento de ${formatPrice(pointsToEuro(roundedPoints))} en tu pedido`
    )
  }

  const handleRemovePoints = () => {
    cart.removePoints()
    setAppliedPoints(0)
    toast.info('Puntos eliminados', 'Los puntos han sido eliminados del pedido')
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Resumen del Pedido
        </h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Free shipping progress */}
        <FreeShippingBar currentAmount={subtotal} threshold={50} />

        {/* Price breakdown */}
        <div className="space-y-2.5 pt-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {shippingCost > 0 ? (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Envío</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm text-primary-600 dark:text-primary-400">
              <span>Envío</span>
              <span className="font-medium">Gratis</span>
            </div>
          )}

          {cart.couponCode && (
            <div className="flex justify-between text-sm text-primary-600 dark:text-primary-400">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                Cupón ({cart.couponCode})
              </span>
              <div className="flex items-center gap-1">
                <span>-{formatPrice(subtotal * cart.discount)}</span>
                <button
                  onClick={cart.removeCoupon}
                  aria-label="Eliminar cupón"
                  className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {cart.pointsApplied > 0 && (
            <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                Puntos ({cart.pointsApplied} pts)
              </span>
              <div className="flex items-center gap-1">
                <span>-{formatPrice(pointsToEuro(cart.pointsApplied))}</span>
                <button
                  onClick={handleRemovePoints}
                  aria-label="Eliminar puntos"
                  className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Coupon */}
        {!cart.couponCode && (
          <div className="pt-2">
            <div className="flex gap-2">
              <Input
                placeholder="Código de descuento"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                aria-label="Introducir código de descuento"
                leftIcon={<Tag className="h-4 w-4" aria-hidden="true" />}
                containerClassName="flex-1"
              />
              <Button
                variant="outline"
                size="md"
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim()}
              >
                Aplicar
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Prueba: VITA10, SAVE15, WELCOME20
            </p>
          </div>
        )}

        {/* Points */}
        {points.balance >= 100 && !cart.pointsApplied && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  Tienes {points.balance} puntos disponibles
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  = {formatPrice(pointsToEuro(points.balance))} de descuento
                </p>
              </div>
              <Button
                variant="secondary"
                size="xs"
                onClick={handleApplyPoints}
                leftIcon={<Coins className="h-3.5 w-3.5" aria-hidden="true" />}
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
              >
                Usar puntos
              </Button>
            </div>
          </div>
        )}

        {/* Points earned preview */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Este pedido vale{' '}
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            +{Math.floor(total)} puntos
          </span>
        </p>

        {/* Checkout button */}
        <Link href="/checkout">
          <Button fullWidth size="lg" rightIcon={<ChevronRight className="h-5 w-5" />}>
            Finalizar Pedido
          </Button>
        </Link>

        <p className="text-xs text-center text-gray-400">
          Pago seguro con SSL · Devolución gratuita en 30 días
        </p>
      </div>
    </div>
  )
}
