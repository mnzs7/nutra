'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Award, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  { Icon: Shield, text: '100% Certificado' },
  { Icon: Award, text: 'Calidad Premium' },
  { Icon: Truck, text: 'Envío Gratis +€50' },
]

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white"
      aria-label="Sección principal"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary-300 animate-pulse" aria-hidden="true" />
              Nuevo: Ashwagandha KSM-66® disponible
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Tu Bienestar{' '}
              <span className="text-primary-300">
                Empieza Aquí
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
              Suplementos de alta calidad, testados y certificados por AESAN, para apoyar tus
              objetivos de salud y bienestar. Más de 50.000 clientes satisfechos en España.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-primary-800 hover:bg-primary-50 focus-visible:ring-white w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Ver Productos
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 focus-visible:ring-white w-full sm:w-auto"
                >
                  Test de Salud
                </Button>
              </Link>
            </div>

            {/* Trust Features */}
            <div className="flex flex-wrap gap-4">
              {features.map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <Icon className="h-4 w-4 text-primary-300 shrink-0" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-full">
              {/* Main image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src="https://picsum.photos/seed/hero-health/600/600"
                  alt="Suplementos de alta calidad VitaShop"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                  priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" aria-hidden="true" />
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 sm:-left-8 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700"
                aria-hidden="true"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                    <span className="text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      4.9/5 estrellas
                    </p>
                    <p className="text-xs text-gray-500">+12.000 reseñas</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-4 -right-4 sm:-right-8 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700"
                aria-hidden="true"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <span className="text-lg">🎁</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      250 pts gratis
                    </p>
                    <p className="text-xs text-gray-500">en tu 1.ª compra</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 40" className="fill-white dark:fill-gray-950 w-full">
          <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </div>
    </section>
  )
}
