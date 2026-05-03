'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Gift } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/lib/store/toastStore'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    lastName: z.string().min(2, 'Apelido deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'Palavra-passe deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: 'Deve aceitar os Termos e Condições',
    }),
    newsletter: z.boolean(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const toast = useToastStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      newsletter: true,
    },
  })

  const password = watch('password')

  // Password strength
  const strength = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
  }
  const strengthScore = Object.values(strength).filter(Boolean).length

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      })

      const json = await response.json()

      if (!response.ok) {
        toast.error('Erro ao criar conta', json.error ?? 'Tente novamente')
        return
      }

      // Auto sign-in after registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        toast.success(
          'Conta criada com sucesso!',
          'Recebeu 250 pontos de boas-vindas. Bem-vindo à VitaShop!'
        )
        router.push('/account')
        router.refresh()
      } else {
        toast.success('Conta criada!', 'Pode agora iniciar sessão.')
        router.push('/auth/login')
      }
    } catch {
      toast.error('Erro de rede', 'Verifique a sua ligação e tente novamente')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              Vita<span className="text-primary-600">Shop</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-black text-gray-900 dark:text-white">
            Criar Conta Grátis
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Já tem conta?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              Iniciar sessão
            </Link>
          </p>
        </div>

        {/* Welcome Bonus */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 shrink-0" aria-hidden="true">
            <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              250 pontos de boas-vindas!
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Equivalente a €2,50 em descontos
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome"
                placeholder="João"
                required
                {...register('firstName')}
                error={errors.firstName?.message}
                autoComplete="given-name"
                leftIcon={<User className="h-4 w-4" aria-hidden="true" />}
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

            <Input
              label="Email"
              type="email"
              placeholder="o.seu@email.pt"
              required
              {...register('email')}
              error={errors.email?.message}
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
            />

            <Input
              label="Palavra-passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              required
              {...register('password')}
              error={errors.password?.message}
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4 text-gray-400" />
                    : <Eye className="h-4 w-4 text-gray-400" />
                  }
                </button>
              }
            />

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="space-y-1.5" aria-live="polite" aria-label="Força da palavra-passe">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strengthScore >= level
                          ? strengthScore <= 1
                            ? 'bg-red-500'
                            : strengthScore <= 2
                            ? 'bg-amber-500'
                            : strengthScore <= 3
                            ? 'bg-yellow-400'
                            : 'bg-primary-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {[
                    { ok: strength.hasLength, label: '8+ caracteres' },
                    { ok: strength.hasUpper, label: 'Maiúscula' },
                    { ok: strength.hasNumber, label: 'Número' },
                    { ok: strength.hasSpecial, label: 'Símbolo' },
                  ].map(({ ok, label }) => (
                    <span
                      key={label}
                      className={`text-xs ${ok ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {ok ? '✓' : '○'} {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirmar Palavra-passe"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repetir palavra-passe"
              required
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                >
                  {showConfirm
                    ? <EyeOff className="h-4 w-4 text-gray-400" />
                    : <Eye className="h-4 w-4 text-gray-400" />
                  }
                </button>
              }
            />

            {/* Checkboxes */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Aceito os{' '}
                    <Link href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Termos e Condições
                    </Link>{' '}
                    e a{' '}
                    <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Política de Privacidade
                    </Link>{' '}
                    <span className="text-red-500" aria-hidden="true">*</span>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 ml-7 text-xs text-red-600" role="alert">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('newsletter')}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Quero receber dicas de saúde e ofertas exclusivas (opcional)
                </span>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="mt-2"
            >
              Criar Conta
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
