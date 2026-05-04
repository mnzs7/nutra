'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Address } from '@/lib/types'

const shippingSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido').max(15),
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  number: z.string().min(1, 'Número obligatorio'),
  complement: z.string().optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Código postal inválido (ej: 28001)'),
  city: z.string().min(2, 'Ciudad obligatoria'),
  state: z.string().min(2, 'Provincia obligatoria'),
  country: z.string().default('España'),
})

type ShippingFormData = z.infer<typeof shippingSchema>

interface ShippingFormProps {
  onSubmit: (data: Address) => void
  defaultValues?: Partial<Address>
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? '',
      lastName: defaultValues?.lastName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      street: defaultValues?.street ?? '',
      number: defaultValues?.number ?? '',
      complement: defaultValues?.complement ?? '',
      postalCode: defaultValues?.postalCode ?? '',
      city: defaultValues?.city ?? '',
      state: defaultValues?.state ?? '',
      country: 'España',
    },
  })

  const handleFormSubmit = (data: ShippingFormData) => {
    onSubmit({ ...data, country: 'España' })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Dirección de Entrega
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ¿Dónde debemos entregar tu pedido?
        </p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          placeholder="Carlos"
          required
          {...register('firstName')}
          error={errors.firstName?.message}
          autoComplete="given-name"
        />
        <Input
          label="Apellidos"
          placeholder="García"
          required
          {...register('lastName')}
          error={errors.lastName?.message}
          autoComplete="family-name"
        />
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="carlos@ejemplo.es"
          required
          {...register('email')}
          error={errors.email?.message}
          autoComplete="email"
        />
        <Input
          label="Teléfono"
          type="tel"
          placeholder="612 345 678"
          required
          {...register('phone')}
          error={errors.phone?.message}
          autoComplete="tel"
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Calle / Avenida"
          placeholder="Calle Mayor"
          required
          {...register('street')}
          error={errors.street?.message}
          containerClassName="sm:col-span-2"
          autoComplete="street-address"
        />
        <Input
          label="Número"
          placeholder="42"
          required
          {...register('number')}
          error={errors.number?.message}
        />
      </div>

      <Input
        label="Complemento"
        placeholder="Piso, puerta, escalera, etc. (opcional)"
        {...register('complement')}
        error={errors.complement?.message}
        autoComplete="address-line2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Código Postal"
          placeholder="28001"
          required
          {...register('postalCode')}
          error={errors.postalCode?.message}
          autoComplete="postal-code"
        />
        <Input
          label="Ciudad"
          placeholder="Madrid"
          required
          {...register('city')}
          error={errors.city?.message}
          containerClassName="sm:col-span-2"
          autoComplete="address-level2"
        />
      </div>

      <Input
        label="Provincia"
        placeholder="Madrid"
        required
        {...register('state')}
        error={errors.state?.message}
        autoComplete="address-level1"
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tus datos están protegidos y nunca se comparten con terceros.
        </p>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          rightIcon={<ChevronRight className="h-5 w-5" />}
          className="sm:shrink-0"
        >
          Continuar al Pago
        </Button>
      </div>
    </form>
  )
}
