'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'warning' | 'danger' | 'info'
  className?: string
  animated?: boolean
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorClasses = {
  primary: 'bg-primary-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  color = 'primary',
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full', colorClasses[color])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-300', colorClasses[color])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}

// Free Shipping specific progress bar
interface FreeShippingBarProps {
  currentAmount: number
  threshold?: number
  className?: string
}

export function FreeShippingBar({
  currentAmount,
  threshold = 50,
  className,
}: FreeShippingBarProps) {
  const remaining = Math.max(0, threshold - currentAmount)
  const percentage = Math.min((currentAmount / threshold) * 100, 100)
  const isFree = remaining === 0

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {isFree ? (
            <span className="font-medium text-primary-600">
              Parabéns! Tem envio gratuito!
            </span>
          ) : (
            <>
              Faltam{' '}
              <span className="font-semibold text-primary-600">
                {remaining.toFixed(2).replace('.', ',')}€
              </span>{' '}
              para envio grátis
            </>
          )}
        </span>
        <span className="text-xs text-gray-500">
          {isFree ? '🎉' : `${percentage.toFixed(0)}%`}
        </span>
      </div>
      <ProgressBar
        value={currentAmount}
        max={threshold}
        size="sm"
        color={isFree ? 'primary' : 'primary'}
        animated
      />
    </div>
  )
}
