'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, ChevronRight, Truck, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils/formatPrice'

// Mock orders data
const mockOrders = [
  {
    id: 'VS1A2B3C4D',
    date: '2024-03-20',
    status: 'delivered' as const,
    items: [
      { name: 'Whey Protein Isolate 90% Premium', qty: 2, price: 49.90 },
      { name: 'Vitamina D3 + K2 Premium', qty: 1, price: 19.99 },
    ],
    total: 119.79,
    trackingCode: 'CTT123456789PT',
  },
  {
    id: 'VS5E6F7G8H',
    date: '2024-02-15',
    status: 'shipped' as const,
    items: [
      { name: 'Ómega-3 Ultra Pure TG 1200mg', qty: 1, price: 29.90 },
    ],
    total: 29.90,
    trackingCode: 'CTT987654321PT',
  },
  {
    id: 'VS9I0J1K2L',
    date: '2024-01-08',
    status: 'delivered' as const,
    items: [
      { name: 'Melatonina Complex Sleep 5mg', qty: 2, price: 24.90 },
      { name: 'Colagénio Marinho Hidrolisado', qty: 1, price: 32.90 },
    ],
    total: 82.70,
  },
]

const statusConfig = {
  pending: {
    label: 'Pendente',
    variant: 'warning' as const,
    Icon: Clock,
    color: 'text-amber-600',
  },
  processing: {
    label: 'Em processamento',
    variant: 'info' as const,
    Icon: Clock,
    color: 'text-blue-600',
  },
  shipped: {
    label: 'Enviado',
    variant: 'info' as const,
    Icon: Truck,
    color: 'text-blue-600',
  },
  delivered: {
    label: 'Entregue',
    variant: 'success' as const,
    Icon: CheckCircle2,
    color: 'text-primary-600',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'danger' as const,
    Icon: XCircle,
    color: 'text-red-600',
  },
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              As Minhas Encomendas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {mockOrders.length} encomendas no total
            </p>
          </div>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto">
              <Package className="h-8 w-8 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Ainda não tem encomendas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              As suas encomendas aparecerão aqui depois da primeira compra.
            </p>
            <Link href="/products">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order, index) => {
              const status = statusConfig[order.status]
              const StatusIcon = status.Icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0">
                        <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          Encomenda #{order.id}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(order.date).toLocaleDateString('pt-PT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" aria-hidden="true" />
                        {status.label}
                      </Badge>
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <ul className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.qty}x {item.name}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {order.trackingCode ? (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Rastreio: </span>
                          <button className="font-mono font-medium text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                            {order.trackingCode}
                          </button>
                        </div>
                      ) : (
                        <div />
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="secondary" size="sm">
                            Comprar novamente
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
