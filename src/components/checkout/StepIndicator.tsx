import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CheckoutStep } from '@/lib/types'

const steps: { id: CheckoutStep; label: string; number: number }[] = [
  { id: 'cart', label: 'Carrito', number: 1 },
  { id: 'shipping', label: 'Envío', number: 2 },
  { id: 'payment', label: 'Pago', number: 3 },
  { id: 'confirmation', label: 'Confirmación', number: 4 },
]

interface StepIndicatorProps {
  currentStep: CheckoutStep
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav aria-label="Progreso del checkout">
      <ol className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = step.id === currentStep
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all',
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : isActive
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/40'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{step.number}</span>
                  )}
                  <span className="sr-only">
                    {isCompleted ? 'Completado: ' : isActive ? 'Actual: ' : ''}
                    {step.label}
                  </span>
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-xs font-medium hidden sm:block',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : isCompleted
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 w-12 sm:w-20 mx-2 mb-5 sm:mb-0 transition-colors',
                    index < currentIndex ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
