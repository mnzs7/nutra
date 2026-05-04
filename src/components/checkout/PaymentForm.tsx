'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Smartphone, Building, ChevronRight, Lock, ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { PaymentInfo } from '@/lib/types'

type PaymentMethod = 'credit_card' | 'mbway' | 'multibanco' | 'paypal'

const cardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Número de tarjeta inválido'),
  cardHolder: z.string().min(3, 'Nombre en la tarjeta obligatorio'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Fecha inválida (MM/AA)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
})

const mbwaySchema = z.object({
  mbwayPhone: z.string().regex(/^[6-7]\d{8}$/, 'Número de móvil inválido'),
})

type CardFormData = z.infer<typeof cardSchema>
type MBWayFormData = z.infer<typeof mbwaySchema>

interface PaymentFormProps {
  onSubmit: (data: PaymentInfo) => void
  onBack: () => void
  isSubmitting?: boolean
}

const paymentMethods: {
  id: PaymentMethod
  label: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    id: 'credit_card',
    label: 'Tarjeta de Crédito / Débito',
    description: 'Visa, Mastercard, American Express',
    Icon: CreditCard,
  },
  {
    id: 'mbway',
    label: 'Bizum',
    description: 'Pago por móvil instantáneo',
    Icon: Smartphone,
  },
  {
    id: 'multibanco',
    label: 'Transferencia Bancaria',
    description: 'Datos bancarios generados al confirmar',
    Icon: Building,
  },
]

function formatCardNumber(value: string) {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts: string[] = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  return parts.length ? parts.join(' ') : value
}

export function PaymentForm({ onSubmit, onBack, isSubmitting }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card')

  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
  })

  const mbwayForm = useForm<MBWayFormData>({
    resolver: zodResolver(mbwaySchema),
    defaultValues: { mbwayPhone: '' },
  })

  const handleSubmit = async () => {
    if (selectedMethod === 'credit_card') {
      const valid = await cardForm.trigger()
      if (!valid) return
      const data = cardForm.getValues()
      onSubmit({
        method: 'credit_card',
        cardNumber: data.cardNumber.replace(/\s/g, '').slice(-4),
        cardHolder: data.cardHolder,
        expiryDate: data.expiryDate,
      })
    } else if (selectedMethod === 'mbway') {
      const valid = await mbwayForm.trigger()
      if (!valid) return
      onSubmit({
        method: 'mbway',
        mbwayPhone: mbwayForm.getValues('mbwayPhone'),
      })
    } else if (selectedMethod === 'multibanco') {
      onSubmit({ method: 'multibanco' })
    } else {
      onSubmit({ method: 'paypal' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Método de Pago
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona cómo quieres pagar tu pedido.
        </p>
      </div>

      {/* Payment Method Selector */}
      <fieldset>
        <legend className="sr-only">Seleccionar método de pago</legend>
        <div className="space-y-3">
          {paymentMethods.map(({ id, label, description, Icon }) => (
            <label
              key={id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer',
                'transition-all duration-200',
                selectedMethod === id
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={id}
                checked={selectedMethod === id}
                onChange={() => setSelectedMethod(id)}
                className="sr-only"
              />
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl shrink-0',
                  selectedMethod === id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    selectedMethod === id
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-900 dark:text-white'
                  )}
                >
                  {label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
              </div>
              {selectedMethod === id && (
                <div
                  className="h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Card Form */}
      {selectedMethod === 'credit_card' && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Lock className="h-4 w-4 text-primary-600" aria-hidden="true" />
            Conexión segura SSL/TLS
          </div>

          <Input
            label="Número de Tarjeta"
            placeholder="4111 1111 1111 1111"
            required
            {...cardForm.register('cardNumber')}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value).slice(0, 19)
              cardForm.setValue('cardNumber', formatted)
            }}
            error={cardForm.formState.errors.cardNumber?.message}
            autoComplete="cc-number"
            inputMode="numeric"
            leftIcon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
          />

          <Input
            label="Nombre en la Tarjeta"
            placeholder="CARLOS A GARCÍA"
            required
            {...cardForm.register('cardHolder')}
            onChange={(e) => cardForm.setValue('cardHolder', e.target.value.toUpperCase())}
            error={cardForm.formState.errors.cardHolder?.message}
            autoComplete="cc-name"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Caducidad (MM/AA)"
              placeholder="12/27"
              required
              {...cardForm.register('expiryDate')}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '')
                if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                cardForm.setValue('expiryDate', v)
              }}
              error={cardForm.formState.errors.expiryDate?.message}
              autoComplete="cc-exp"
              inputMode="numeric"
              maxLength={5}
            />
            <Input
              label="CVV"
              placeholder="123"
              required
              {...cardForm.register('cvv')}
              error={cardForm.formState.errors.cvv?.message}
              autoComplete="cc-csc"
              inputMode="numeric"
              maxLength={4}
              type="password"
            />
          </div>
        </div>
      )}

      {/* Bizum Form */}
      {selectedMethod === 'mbway' && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Recibirás una solicitud de pago en la app Bizum asociada al número indicado.
          </p>
          <Input
            label="Número de Móvil"
            placeholder="612 345 678"
            required
            {...mbwayForm.register('mbwayPhone')}
            error={mbwayForm.formState.errors.mbwayPhone?.message}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            leftIcon={<Smartphone className="h-4 w-4" aria-hidden="true" />}
          />
        </div>
      )}

      {/* Transferencia Bancaria */}
      {selectedMethod === 'multibanco' && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Tras confirmar el pedido, recibirás los datos bancarios para realizar la transferencia.
            El pedido se procesará una vez confirmado el pago (hasta 48 horas hábiles).
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Volver al Envío
        </Button>
        <Button
          size="lg"
          isLoading={isSubmitting}
          onClick={handleSubmit}
          rightIcon={<ChevronRight className="h-5 w-5" />}
          className="sm:shrink-0"
        >
          Confirmar Pago
        </Button>
      </div>
    </div>
  )
}
