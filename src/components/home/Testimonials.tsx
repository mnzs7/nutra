'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'

const testimonials = [
  {
    id: 1,
    author: 'Ana Rodrigues',
    role: 'Personal Trainer',
    avatar: 'https://picsum.photos/seed/ana/100/100',
    rating: 5,
    text: 'Uso os produtos VitaShop há 2 anos. A qualidade é incomparável e os resultados falam por si. O Whey Protein Isolate é o melhor que já experimentei!',
    product: 'Whey Protein Isolate 90%',
  },
  {
    id: 2,
    author: 'Carlos Mendes',
    role: 'Médico de Família',
    avatar: 'https://picsum.photos/seed/carlos/100/100',
    rating: 5,
    text: 'Recomendo os suplementos VitaShop aos meus doentes. A transparência nos ingredientes e as certificações de qualidade transmitem-me confiança total.',
    product: 'Vitamina D3 + K2 Premium',
  },
  {
    id: 3,
    author: 'Sofia Lima',
    role: 'Nutricionista Clínica',
    avatar: 'https://picsum.photos/seed/sofia/100/100',
    rating: 5,
    text: 'Como nutricionista, estou muito atenta à qualidade dos suplementos. A VitaShop destaca-se pela rastreabilidade dos ingredientes e ausência de aditivos desnecessários.',
    product: 'Complexo B Vitamínico',
  },
  {
    id: 4,
    author: 'Ricardo Ferreira',
    role: 'Atleta Profissional',
    avatar: 'https://picsum.photos/seed/ricardo/100/100',
    rating: 5,
    text: 'O Pré-Treino Explosive Force transformou os meus treinos. Sem jitters, energia real e sustentada. As doses são eficazes e clinicamente suportadas.',
    product: 'Pré-Treino Explosive Force',
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
            Depoimentos
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-black text-gray-900 dark:text-white mb-3"
          >
            O Que Dizem Os Nossos Clientes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Mais de 50.000 clientes confiam na VitaShop. Veja algumas das suas experiências.
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
              aria-label={`Depoimento de ${t.author}`}
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
                  Produto: {t.product}
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
            { value: '50K+', label: 'Clientes satisfeitos' },
            { value: '4.9/5', label: 'Avaliação média' },
            { value: '99%', label: 'Taxa de recomendação' },
            { value: '30d', label: 'Devolução gratuita' },
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
