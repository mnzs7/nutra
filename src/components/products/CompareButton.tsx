'use client'

import Link from 'next/link'
import { BarChart2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCompareStore } from '@/lib/store/compareStore'
import { Button } from '@/components/ui/Button'

export function CompareFloatingBar() {
  const { items, removeItem, clearCompare } = useCompareStore()

  if (items.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4"
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-900 dark:bg-gray-800 px-4 py-3 shadow-2xl border border-gray-700">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary-400 shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium text-white">
              {items.length} produto{items.length !== 1 ? 's' : ''} para comparar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-gray-700"
                  title={item.name}
                >
                  <span className="text-xs text-gray-300 font-bold">
                    {item.name.charAt(0)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/90 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:opacity-100"
                    aria-label={`Remover ${item.name} do comparador`}
                  >
                    <X className="h-3 w-3 text-white" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={clearCompare}
              className="text-xs text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1"
              aria-label="Limpar comparador"
            >
              Limpar
            </button>

            <Link href="/compare">
              <Button size="sm" className="shrink-0">
                Comparar
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
