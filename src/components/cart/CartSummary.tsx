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
      toast.success('Cupão aplicado!', `Desconto de ${Math.round(cart.discount * 100)}% adicionado`)
      setCouponInput('')
    } else {
      toast.error('Cupão inválido', 'O código inserido não é válido ou já expirou')
    }
  }

  const handleApplyPoints = () => {
    if (points.balance < 100) {
      toast.warning('Pontos insuficientes', 'Precisa de pelo menos 100 pontos (€1) para usar')
      return
    }

    // Use all available points up to 50% of total
    const maxPointsToUse = Math.min(points.balance, Math.floor(total * 50))
    const roundedPoints = Math.floor(maxPointsToUse / 100) * 100 // Round to nearest 100

    if (roundedPoints === 0) {
      toast.warning('Pontos insuficientes', 'Não tem pontos suficientes para redimir')
      return
    }

    cart.applyPoints(roundedPoints)
    setAppliedPoints(roundedPoints)
    toast.success(
      `${roundedPoints} pontos aplicados`,
      `Desconto de ${formatPrice(pointsToEuro(roundedPoints))} na sua encomenda`
    )
  }

  const handleRemovePoints = () => {
    cart.removePoints()
    setAppliedPoints(0)
    toast.info('Pontos removidos', 'Os pontos foram removidos da encomenda')
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Resumo da Encomenda
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
              <span>Envio</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm text-primary-600 dark:text-primary-400">
              <span>Envio</span>
              <span className="font-medium">Grátis</span>
            </div>
          )}

          {cart.couponCode && (
            <div className="flex justify-between text-sm text-primary-600 dark:text-primary-400">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                Cupão ({cart.couponCode})
              </span>
              <div className="flex items-center gap-1">
                <span>-{formatPrice(subtotal * cart.discount)}</span>
                <button
                  onClick={cart.removeCoupon}
                  aria-label="Remover cupão"
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
                Pontos ({cart.pointsApplied} pts)
              </span>
              <div className="flex items-center gap-1">
                <span>-{formatPrice(pointsToEuro(cart.pointsApplied))}</span>
                <button
                  onClick={handleRemovePoints}
                  aria-label="Remover pontos"
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
                placeholder="Código de desconto"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                aria-label="Inserir código de desconto"
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
              Experimente: VITA10, SAVE15, WELCOME20
            </p>
          </div>
        )}

        {/* Points */}
        {points.balance >= 100 && !cart.pointsApplied && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  Tem {points.balance} pontos disponíveis
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  = {formatPrice(pointsToEuro(points.balance))} de desconto
                </p>
              </div>
              <Button
                variant="secondary"
                size="xs"
                onClick={handleApplyPoints}
                leftIcon={<Coins className="h-3.5 w-3.5" aria-hidden="true" />}
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
              >
                Usar pontos
              </Button>
            </div>
          </div>
        )}

        {/* Points earned preview */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Esta encomenda vale{' '}
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            +{Math.floor(total)} pontos
          </span>
        </p>

        {/* Checkout button */}
        <Link href="/checkout">
          <Button fullWidth size="lg" rightIcon={<ChevronRight className="h-5 w-5" />}>
            Finalizar Encomenda
          </Button>
        </Link>

        <p className="text-xs text-center text-gray-400">
          Pagamento seguro com SSL · Devolução gratuita em 30 dias
        </p>
      </div>
    </div>
  )
}
