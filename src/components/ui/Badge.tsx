import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success:
    'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  danger:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  outline:
    'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-200',
}

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
