'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { User, ArrowLeft, Save, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/lib/store/toastStore'

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido').optional().or(z.literal('')),
  birthDate: z.string().optional(),
  newsletter: z.boolean(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

function getNameParts(fullName?: string | null) {
  if (!fullName) return { firstName: '', lastName: '' }
  const parts = fullName.trim().split(' ')
  const firstName = parts[0] ?? ''
  const lastName = parts.slice(1).join(' ') || ''
  return { firstName, lastName }
}

export default function ProfilePage() {
  const toast = useToastStore()
  const { data: session, update } = useSession()
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const { firstName, lastName } = getNameParts(session?.user?.name)
  const userEmail = session?.user?.email ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName,
      lastName,
      email: userEmail,
      phone: '',
      birthDate: '',
      newsletter: true,
    },
  })

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    formState: { errors: pwErrors, isSubmitting: isPwSubmitting },
    reset: resetPw,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmitProfile = async (data: ProfileFormData) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim()

    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName }),
    })

    const json = await response.json()

    if (!response.ok) {
      toast.error('Error al guardar', json.error ?? 'Inténtalo de nuevo')
      return
    }

    await update({ name: fullName })
    reset({ ...data })
    toast.success('Perfil actualizado', 'Tu información se ha guardado correctamente')
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: session?.user?.name ?? '',
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    })

    const json = await response.json()

    if (!response.ok) {
      toast.error('Error al cambiar la contraseña', json.error ?? 'Inténtalo de nuevo')
      return
    }

    resetPw()
    setShowPasswordSection(false)
    toast.success('Contraseña cambiada', 'Tu contraseña se ha actualizado correctamente')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Perfil y Datos Personales
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Gestiona tu información personal
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 shrink-0">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? 'Avatar'}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {session?.user?.name ?? 'Usuario'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userEmail}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitProfile)} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                required
                {...register('firstName')}
                error={errors.firstName?.message}
                autoComplete="given-name"
              />
              <Input
                label="Apellidos"
                required
                {...register('lastName')}
                error={errors.lastName?.message}
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Email"
              type="email"
              required
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
              disabled
              hint="El email no se puede cambiar"
            />

            <Input
              label="Teléfono"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              autoComplete="tel"
            />

            <Input
              label="Fecha de Nacimiento"
              type="date"
              {...register('birthDate')}
              error={errors.birthDate?.message}
              autoComplete="bday"
            />

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('newsletter')}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Suscribirse al boletín
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Recibir consejos de salud, novedades y ofertas exclusivas por email
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isDirty}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Guardar Cambios
              </Button>
            </div>
          </form>

          {/* Change Password */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Seguridad
              </h2>
            </div>

            {!showPasswordSection ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Lock className="h-4 w-4" />}
                onClick={() => setShowPasswordSection(true)}
              >
                Cambiar contraseña
              </Button>
            ) : (
              <form onSubmit={handleSubmitPw(onSubmitPassword)} noValidate className="space-y-4">
                <Input
                  label="Contraseña actual"
                  type={showCurrentPw ? 'text' : 'password'}
                  required
                  {...registerPw('currentPassword')}
                  error={pwErrors.currentPassword?.message}
                  autoComplete="current-password"
                  leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      aria-label={showCurrentPw ? 'Ocultar' : 'Mostrar'}
                    >
                      {showCurrentPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  }
                />

                <Input
                  label="Nueva contraseña"
                  type={showNewPw ? 'text' : 'password'}
                  required
                  {...registerPw('newPassword')}
                  error={pwErrors.newPassword?.message}
                  autoComplete="new-password"
                  leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      aria-label={showNewPw ? 'Ocultar' : 'Mostrar'}
                    >
                      {showNewPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  }
                />

                <Input
                  label="Confirmar nueva contraseña"
                  type={showConfirmPw ? 'text' : 'password'}
                  required
                  {...registerPw('confirmNewPassword')}
                  error={pwErrors.confirmNewPassword?.message}
                  autoComplete="new-password"
                  leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      aria-label={showConfirmPw ? 'Ocultar' : 'Mostrar'}
                    >
                      {showConfirmPw ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  }
                />

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isPwSubmitting}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Guardar contraseña
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPasswordSection(false)
                      resetPw()
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Danger Zone */}
          <div className="mt-6 pt-6 border-t border-red-100 dark:border-red-900/30">
            <h2 className="text-base font-bold text-red-600 dark:text-red-400 mb-2">
              Zona de Peligro
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Eliminar tu cuenta es una acción irreversible. Todos tus datos serán borrados permanentemente.
            </p>
            <Button variant="danger" size="sm">
              Eliminar cuenta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
