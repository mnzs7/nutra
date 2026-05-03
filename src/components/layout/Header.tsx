'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Award,
  ChevronDown,
  LogOut,
  Settings,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cartStore'
import { useWishlistStore } from '@/lib/store/wishlistStore'
import { usePointsStore } from '@/lib/store/pointsStore'
import { SearchBar } from '@/components/search/SearchBar'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/products', label: 'Produtos' },
  {
    href: '#',
    label: 'Categorias',
    children: [
      { href: '/products?category=vitaminas', label: 'Vitaminas' },
      { href: '/products?category=proteina', label: 'Proteína' },
      { href: '/products?category=omega3', label: 'Ómega-3' },
      { href: '/products?category=pre-treino', label: 'Pré-Treino' },
      { href: '/products?category=sono', label: 'Sono' },
      { href: '/products?category=colageno', label: 'Colagénio' },
    ],
  },
  { href: '/quiz', label: 'Quiz Saúde' },
  { href: '/compare', label: 'Comparar' },
]

function getUserInitials(name?: string | null): string {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  const cartCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const pointsBalance = usePointsStore((s) => s.balance)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary-600 text-white text-center text-xs py-2 px-4">
        <p>
          Envio grátis em encomendas acima de €50 | Pontos de fidelidade em cada compra
          <Link href="/quiz" className="ml-2 underline font-semibold hover:no-underline">
            Faça o quiz de saúde
          </Link>
        </p>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800'
            : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
              aria-label="VitaShop - Ir para a página inicial"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <span className="text-white font-bold text-lg" aria-hidden="true">
                  V
                </span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
                Vita<span className="text-primary-600">Shop</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Navegação principal"
            >
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.children ? (
                    <button
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                        'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                        'transition-colors'
                      )}
                      aria-expanded={activeDropdown === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform',
                          activeDropdown === link.label && 'rotate-180'
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                        'transition-colors',
                        pathname === link.href
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden py-1"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
              <SearchBar className="w-full" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Points */}
              <Link
                href="/account"
                className={cn(
                  'hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                  'text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
                  'hover:bg-amber-100 dark:hover:bg-amber-900/30',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  'transition-colors'
                )}
                aria-label={`${pointsBalance} pontos de fidelidade`}
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>{pointsBalance} pts</span>
              </Link>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    'p-2 rounded-lg text-gray-600 dark:text-gray-300',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    'transition-colors'
                  )}
                  aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Moon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/account"
                className={cn(
                  'relative p-2 rounded-lg text-gray-600 dark:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-colors'
                )}
                aria-label={`Lista de desejos (${wishlistCount} produtos)`}
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  'relative p-2 rounded-lg text-gray-600 dark:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-colors'
                )}
                aria-label={`Carrinho de compras (${cartCount} ${cartCount === 1 ? 'produto' : 'produtos'})`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white"
                      aria-hidden="true"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Account / Auth */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg',
                      'text-sm font-medium text-gray-700 dark:text-gray-200',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      'transition-colors'
                    )}
                    aria-label="Menu da conta"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    {session.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? 'Avatar'}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold shrink-0">
                        {getUserInitials(session.user?.name)}
                      </div>
                    )}
                    <span className="hidden xl:block max-w-[100px] truncate">
                      {session.user?.name?.split(' ')[0] ?? 'Conta'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform hidden xl:block',
                        userMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden py-1 z-50"
                        role="menu"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          role="menuitem"
                        >
                          <User className="h-4 w-4" aria-hidden="true" />
                          A Minha Conta
                        </Link>
                        <Link
                          href="/account/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          role="menuitem"
                        >
                          <Settings className="h-4 w-4" aria-hidden="true" />
                          Perfil e Dados
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            role="menuitem"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Sair
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className={cn(
                    'hidden sm:flex items-center gap-1.5 pl-2 pr-3 py-2 rounded-lg',
                    'text-sm font-medium text-gray-700 dark:text-gray-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    'transition-colors'
                  )}
                  aria-label="Iniciar sessão"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden xl:block">Entrar</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  'lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'transition-colors'
                )}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <SearchBar onClose={() => setMobileOpen(false)} />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-gray-200 dark:border-gray-800 lg:hidden"
            >
              <nav
                className="container mx-auto max-w-7xl px-4 py-4 space-y-1"
                aria-label="Navegação mobile"
              >
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {link.label}
                      </p>
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        pathname === link.href
                          ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session?.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        A Minha Conta
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Entrar
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
