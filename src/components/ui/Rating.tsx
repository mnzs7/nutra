import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  count?: number
  className?: string
  interactive?: boolean
  onChange?: (value: number) => void
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  count,
  className,
  interactive = false,
  onChange,
}: RatingProps) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`Avaliação: ${value} de ${max} estrelas${count !== undefined ? `, ${count} avaliações` : ''}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1
          const isFull = starValue <= Math.floor(value)
          const isHalf = !isFull && starValue === Math.ceil(value) && value % 1 >= 0.5

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              onClick={interactive && onChange ? () => onChange(starValue) : undefined}
              disabled={!interactive}
              aria-label={interactive ? `${starValue} estrelas` : undefined}
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? starValue === value : undefined}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFull || isHalf
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                )}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star
                    className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 ml-1">
          {value.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({count.toLocaleString('pt-PT')})
        </span>
      )}
    </div>
  )
}
