import Image from 'next/image'
import { formatPrice, getSubscriptionPrice } from '@/lib/utils/formatPrice'
import type { CartItem, Address } from '@/lib/types'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  shipping?: Address
  compact?: boolean
}

export function OrderSummary({
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  shipping,
  compact = false,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Resumo da Encomenda
        </h3>
      </div>

      <div className="p-5">
        {/* Items */}
        <ul className="space-y-3 mb-4" aria-label="Artigos na encomenda">
          {items.map((item) => {
            const unitPrice =
              item.subscription === 'monthly'
                ? getSubscriptionPrice(item.product.price)
                : item.product.price
            return (
              <li
                key={`${item.product.id}-${item.subscription}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-[10px] font-bold text-white"
                    aria-label={`${item.quantity} unidades`}
                  >
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {item.product.name}
                  </p>
                  {item.subscription === 'monthly' && (
                    <p className="text-xs text-primary-600 dark:text-primary-400">
                      Subscrição mensal (-15%)
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                  {formatPrice(unitPrice * item.quantity)}
                </span>
              </li>
            )
          })}
        </ul>

        {/* Price breakdown */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Envio</span>
            <span
              className={
                shippingCost === 0
                  ? 'font-medium text-primary-600 dark:text-primary-400'
                  : ''
              }
            >
              {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-primary-600 dark:text-primary-400">
              <span>Desconto</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Shipping address */}
        {shipping && !compact && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Morada de Entrega
            </p>
            <address className="text-sm text-gray-700 dark:text-gray-200 not-italic">
              {shipping.firstName} {shipping.lastName}
              <br />
              {shipping.street}, {shipping.number}
              {shipping.complement && `, ${shipping.complement}`}
              <br />
              {shipping.postalCode} {shipping.city}
              <br />
              {shipping.state}, {shipping.country}
            </address>
          </div>
        )}
      </div>
    </div>
  )
}
