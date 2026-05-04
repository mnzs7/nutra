'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User,
  Package,
  MapPin,
  Award,
  Heart,
  Settings,
  ChevronRight,
  TrendingUp,
  Gift,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePointsStore } from '@/lib/store/pointsStore'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { formatPrice, pointsToEuro } from '@/lib/utils/formatPrice'
import { ProgressBar } from '@/components/ui/ProgressBar'

const menuItems = [
  { href: '/account/orders', Icon: Package, label: 'Mis Pedidos', description: '3 pedidos', badge: '3' },
  { href: '/account/profile', Icon: User, label: 'Perfil y Datos', description: 'Actualizar información personal' },
  { href: '/account', Icon: MapPin, label: 'Direcciones Guardadas', description: '1 dirección guardada' },
  { href: '/account', Icon: Heart, label: 'Lista de Deseos', description: 'Ver favoritos', badge: null },
  { href: '/account', Icon: Settings, label: 'Configuración', description: 'Preferencias y notificaciones' },
]

// Points tiers
const TIERS = [
  { name: 'Bronce', min: 0, max: 500, color: 'text-amber-700', bg: 'bg-amber-100' },
  { name: 'Plata', min: 500, max: 1500, color: 'text-gray-500', bg: 'bg-gray-100' },
  { name: 'Oro', min: 1500, max: 3000, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { name: 'Platino', min: 3000, max: Infinity, color: 'text-blue-600', bg: 'bg-blue-100' },
]

function getCurrentTier(points: number) {
  return TIERS.find((t) => points >= t.min && points < t.max) ?? TIERS[0]
}

function getNextTier(points: number) {
  const idx = TIERS.findIndex((t) => points >= t.min && points < t.max)
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

export default function AccountPage() {
  const { data: session } = useSession()
  const { balance, transactions } = usePointsStore()
  const wishlistCount = useWishlistStore((s) => s.items.length)

  const currentTier = getCurrentTier(balance)
  const nextTier = getNextTier(balance)

  const recentTransactions = transactions.slice(0, 5)

  const userName = session?.user?.name ?? 'Usuario VitaShop'
  const userEmail = session?.user?.email ?? ''
  const firstName = userName.split(' ')[0]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
          Mi Cuenta
        </h1>

        {/* Welcome + Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="sm:col-span-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={userName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="text-sm text-white/80">Bienvenido de nuevo,</p>
                <p className="text-xl font-bold">{firstName}</p>
              </div>
            </div>
            <p className="text-sm text-white/80">
              {userEmail && (
                <span className="block truncate">{userEmail}</span>
              )}
              {transactions.length} transacciones de puntos
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {balance} puntos
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentTier.bg} ${currentTier.color}`}>
                {currentTier.name}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Valor: {formatPrice(pointsToEuro(balance))}
            </p>
            {nextTier && (
              <>
                <ProgressBar value={balance - currentTier.min} max={nextTier.min - currentTier.min} size="sm" animated={false} />
                <p className="text-xs text-gray-400 mt-1.5">
                  {nextTier.min - balance} puntos para {nextTier.name}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Menú
            </h2>
            {menuItems.map(({ href, Icon, label, description, badge }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20 shrink-0">
                  <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {label === 'Lista de Deseos'
                      ? `${wishlistCount} producto${wishlistCount !== 1 ? 's' : ''}`
                      : description}
                  </p>
                </div>
                {badge && (
                  <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white px-1.5">
                    {badge}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>

          {/* Points History */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Historial de Puntos
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Sin transacciones aún
                </div>
              ) : (
                <ul>
                  {recentTransactions.map((txn, i) => (
                    <motion.li
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-3 p-3.5 ${i < recentTransactions.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${txn.type === 'earned' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}
                        aria-hidden="true"
                      >
                        {txn.type === 'earned'
                          ? <TrendingUp className="h-4 w-4 text-primary-600" />
                          : <Gift className="h-4 w-4 text-red-500" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {txn.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(txn.date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold shrink-0 ${txn.type === 'earned' ? 'text-primary-600' : 'text-red-500'}`}
                        aria-label={`${txn.type === 'earned' ? 'Ganaste' : 'Usaste'} ${txn.points} puntos`}
                      >
                        {txn.type === 'earned' ? '+' : '-'}{txn.points}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
