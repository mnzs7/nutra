'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, CheckCircle2, Gift } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/lib/store/toastStore'

const schema = z.object({
  email: z.string().email('Por favor insira um email válido'),
})

type FormData = z.infer<typeof schema>

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false)
  const toast = useToastStore()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    toast.success(
      'Subscrito com sucesso!',
      `Bem-vindo! O código WELCOME20 foi enviado para ${data.email}`
    )
  }

  return (
    <section
      className="py-16 bg-primary-600 text-white"
      aria-labelledby="newsletter-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black mb-2">Obrigado pela subscrição!</h2>
                <p className="text-white/80">
                  Enviámos o seu código de desconto <strong>WELCOME20</strong> por email.
                  Aproveite 20% na sua primeira encomenda!
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20"
                  aria-hidden="true"
                >
                  <Mail className="h-7 w-7" />
                </div>
              </div>

              <h2
                id="newsletter-heading"
                className="text-3xl font-black mb-3"
              >
                Subscreva a Nossa Newsletter
              </h2>

              <p className="text-white/80 mb-2 text-lg">
                Receba dicas de saúde, novidades e ofertas exclusivas
              </p>

              <div className="flex items-center justify-center gap-2 mb-8 text-sm text-white/80">
                <Gift className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-white">Bónus:</strong> 20% de desconto na 1ª encomenda ao subscrever
                </span>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                aria-label="Subscrever newsletter"
              >
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email para subscrição
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="o.seu@email.pt"
                    {...register('email')}
                    error={errors.email?.message}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:bg-white/20"
                    autoComplete="email"
                  />
                </div>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-white text-primary-700 hover:bg-white/90 focus-visible:ring-white shrink-0"
                  size="md"
                >
                  Subscrever
                </Button>
              </form>

              <p className="mt-4 text-xs text-white/60">
                Sem spam. Cancele a qualquer momento. Consulte a nossa{' '}
                <a
                  href="/privacy"
                  className="underline hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                >
                  política de privacidade
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
