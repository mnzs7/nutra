'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Address } from '@/lib/types'

const shippingSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Apelido deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone inválido').max(15),
  street: z.string().min(5, 'Morada deve ter pelo menos 5 caracteres'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  postalCode: z.string().regex(/^\d{4}-\d{3}$/, 'Código postal inválido (ex: 1200-001)'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Distrito obrigatório'),
  country: z.string().default('Portugal'),
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
      country: 'Portugal',
    },
  })

  const handleFormSubmit = (data: ShippingFormData) => {
    onSubmit({ ...data, country: 'Portugal' })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Morada de Entrega
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Onde devemos entregar a sua encomenda?
        </p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome"
          placeholder="João"
          required
          {...register('firstName')}
          error={errors.firstName?.message}
          autoComplete="given-name"
        />
        <Input
          label="Apelido"
          placeholder="Silva"
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
          placeholder="joao@exemplo.pt"
          required
          {...register('email')}
          error={errors.email?.message}
          autoComplete="email"
        />
        <Input
          label="Telefone"
          type="tel"
          placeholder="912 345 678"
          required
          {...register('phone')}
          error={errors.phone?.message}
          autoComplete="tel"
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Rua / Avenida"
          placeholder="Rua da Saúde"
          required
          {...register('street')}
          error={errors.street?.message}
          containerClassName="sm:col-span-2"
          autoComplete="street-address"
        />
        <Input
          label="Número"
          placeholder="123"
          required
          {...register('number')}
          error={errors.number?.message}
        />
      </div>

      <Input
        label="Complemento"
        placeholder="Apartamento, andar, etc. (opcional)"
        {...register('complement')}
        error={errors.complement?.message}
        autoComplete="address-line2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Código Postal"
          placeholder="1200-001"
          required
          {...register('postalCode')}
          error={errors.postalCode?.message}
          autoComplete="postal-code"
        />
        <Input
          label="Cidade"
          placeholder="Lisboa"
          required
          {...register('city')}
          error={errors.city?.message}
          containerClassName="sm:col-span-2"
          autoComplete="address-level2"
        />
      </div>

      <Input
        label="Distrito"
        placeholder="Lisboa"
        required
        {...register('state')}
        error={errors.state?.message}
        autoComplete="address-level1"
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Os seus dados são protegidos e nunca partilhados com terceiros.
        </p>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          rightIcon={<ChevronRight className="h-5 w-5" />}
          className="sm:shrink-0"
        >
          Continuar para Pagamento
        </Button>
      </div>
    </form>
  )
}
