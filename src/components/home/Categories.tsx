'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { categories } from '@/lib/data/products'
import { products } from '@/lib/data/products'
import { ArrowRight } from 'lucide-react'

export function Categories() {
  const getCategoryCount = (catId: string) =>
    products.filter((p) => p.category === catId).length

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" aria-labelledby="categories-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="categories-heading"
            className="text-3xl font-black text-gray-900 dark:text-white mb-3"
          >
            Categorias de Produtos
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Encontre os suplementos ideais para os seus objetivos de saúde e bem-estar.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-300 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={`Ver produtos de ${cat.label}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${cat.color} transition-transform group-hover:scale-110`}
                  aria-hidden="true"
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {getCategoryCount(cat.id)} produtos
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
          >
            Ver todos os produtos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
