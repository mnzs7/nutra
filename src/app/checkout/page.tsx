'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useCart } from '@/lib/hooks/useCart'
import { useToastStore } from '@/lib/store/toastStore'
import { StepIndicator } from '@/components/checkout/StepIndicator'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Address, PaymentInfo, CheckoutStep } from '@/lib/types'

function generateOrderId() {
  return `VS${Date.now().toString(36).toUpperCase()}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const cartStore = useCartStore()
  const { checkout } = useCart()
  const toast = useToastStore()

  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [shipping, setShipping] = useState<Address | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [earnedPoints, setEarnedPoints] = useState(0)

  const items = cartStore.items
  const subtotal = cartStore.getSubtotal()
  const shippingCost = cartStore.getShippingCost()
  const discountAmount = cartStore.getDiscountAmount()
  const total = cartStore.getTotal()

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto">
            <Package className="h-8 w-8 text-gray-400" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Carrito vacío
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Añade productos al carrito antes de hacer checkout.
          </p>
          <Link href="/products">
            <Button>Ver Productos</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (data: Address) => {
    setShipping(data)
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePaymentSubmit = async (paymentData: PaymentInfo) => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const id = generateOrderId()
    const points = checkout(total)

    setOrderId(id)
    setEarnedPoints(points)
    setStep('confirmation')
    setIsProcessing(false)

    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.success('¡Pedido confirmado!', `Pedido #${id} recibido con éxito`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {step !== 'confirmation' && (
            <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al carrito
            </Link>
          )}
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
            {step === 'confirmation' ? '¡Pedido Confirmado!' : 'Checkout'}
          </h1>
          {step !== 'confirmation' && <StepIndicator currentStep={step} />}
        </div>

        {step === 'confirmation' ? (
          /* Confirmation */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mx-auto mb-6"
              >
                <CheckCircle2 className="h-10 w-10 text-primary-600" aria-hidden="true" />
              </motion.div>

              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                ¡Gracias por tu pedido!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Número de pedido:{' '}
                <strong className="text-gray-900 dark:text-white">#{orderId}</strong>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Recibirás un email de confirmación en breve con todos los detalles.
              </p>
            </div>

            {/* Points earned */}
            {earnedPoints > 0 && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  🏆 ¡Enhorabuena! Has ganado <strong>{earnedPoints} puntos</strong> con este pedido.
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Puntos disponibles en tu próxima compra
                </p>
              </div>
            )}

            {/* Delivery info */}
            {shipping && (
              <div className="mb-6 text-sm text-left p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white mb-1">Entrega prevista:</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <address className="mt-2 text-gray-500 dark:text-gray-400 not-italic">
                  {shipping.firstName} {shipping.lastName}<br />
                  {shipping.street}, {shipping.number}<br />
                  {shipping.postalCode} {shipping.city}
                </address>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link href="/account/orders">
                <Button fullWidth variant="outline">
                  Ver Mis Pedidos
                </Button>
              </Link>
              <Link href="/products">
                <Button fullWidth>Seguir Comprando</Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <AnimatePresence mode="wait">
                  {step === 'shipping' && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ShippingForm onSubmit={handleShippingSubmit} />
                    </motion.div>
                  )}

                  {step === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <PaymentForm
                        onSubmit={handlePaymentSubmit}
                        onBack={() => setStep('shipping')}
                        isSubmitting={isProcessing}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <div>
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                discount={discountAmount}
                total={total}
                shipping={shipping ?? undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
