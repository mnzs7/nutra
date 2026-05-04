'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'
import { useToastStore } from '@/lib/store/toastStore'
import { cn } from '@/lib/utils/cn'
import type { Toast as ToastType, ToastType as ToastVariant } from '@/lib/types'

const TOAST_CONFIG: Record<ToastVariant, { icon: React.ReactNode; bg: string; progress: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-primary-600" aria-hidden="true" />,
    bg: 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-950/50',
    progress: 'bg-primary-500',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />,
    bg: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50',
    progress: 'bg-red-500',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />,
    bg: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50',
    progress: 'bg-amber-500',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-600" aria-hidden="true" />,
    bg: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50',
    progress: 'bg-blue-500',
  },
}

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const duration = toast.duration ?? 3000
  const config = TOAST_CONFIG[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-xl border shadow-lg',
        config.bg
      )}
    >
      <motion.div
        className={cn('absolute bottom-0 left-0 h-0.5', config.progress)}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />

      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</p>
          {toast.message && (
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="shrink-0 ml-auto rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-label="Notificaciones"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
