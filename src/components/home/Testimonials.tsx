'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'

const testimonials = [
  {
    id: 1,
    author: 'Ana Rodríguez',
    role: 'Personal Trainer',
    avatar: 'https://picsum.photos/seed/ana/100/100',
    rating: 5,
    text: 'Llevo 2 años usando los productos VitaShop. La calidad es incomparable y los resultados hablan por sí solos. ¡El Whey Protein Isolate es el mejor que he probado!',
    product: 'Whey Protein Isolate 90%',
  },
  {
    id: 2,
    author: 'Carlos Méndez',
    role: 'Médico de Familia',
    avatar: 'https://picsum.photos/seed/carlos/100/100',
    rating: 5,
    text: 'Recomiendo los suplementos VitaShop a mis pacientes. La transparencia en los ingredientes y las certificaciones de calidad me transmiten total confianza.',
    product: 'Vitamina D3 + K2 Premium',
  },
  {
    id: 3,
    author: 'Sofía Lima',
    role: 'Nutricionista Clínica',
    avatar: 'https://picsum.photos/seed/sofia/100/100',
    rating: 5,
    text: 'Como nutricionista, soy muy exigente con la calidad de los suplementos. VitaShop destaca por la trazabilidad de los ingredientes y la ausencia de aditivos innecesarios.',
    product: 'Complejo B Vitamínico',
  },
  {
    id: 4,
    author: 'Ricardo Ferrer',
    role: 'Atleta Profesional',
    avatar: 'https://picsum.photos/seed/ricardo/100/100',
    rating: 5,
    text: 'El Pre-Entrenamiento Explosive Force ha transformado mis entrenos. Sin nerviosismo, energía real y sostenida. Las dosis son eficaces y clínicamente respaldadas.',
    product: 'Pre-Entrenamiento Explosive Force',
  },
]

export function Testimonials() {
  return (
    <section
      className="py-16 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1 uppercase tracking-wide">
            Testimonios
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-black text-gray-900 dark:text-white mb-3"
          >
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Más de 50.000 clientes confían en VitaShop. Lee algunas de sus experiencias.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              aria-label={`Testimonio de ${t.author}`}
            >
              <Quote
                className="h-8 w-8 text-primary-100 dark:text-primary-900/50 mb-3"
                aria-hidden="true"
              />

              <Rating value={t.rating} size="sm" className="mb-3" />

              <blockquote>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
              </blockquote>

              <footer>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-3">
                  Producto: {t.product}
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 shrink-0"
                    aria-hidden="true"
                  >
                    {/* Avoid next/image for testimonial avatars to simplify */}
                    <div
                      className="h-full w-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm"
                    >
                      {t.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <cite className="text-sm font-semibold text-gray-900 dark:text-white not-italic">
                      {t.author}
                    </cite>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '50K+', label: 'Clientes satisfechos' },
            { value: '4.9/5', label: 'Valoración media' },
            { value: '99%', label: 'Tasa de recomendación' },
            { value: '30d', label: 'Devolución gratuita' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <p className="text-2xl sm:text-3xl font-black text-primary-600 dark:text-primary-400 mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
