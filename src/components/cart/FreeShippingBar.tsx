import { FreeShippingBar as FreeShippingBarBase } from '@/components/ui/ProgressBar'

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
  return (
    <FreeShippingBarBase
      currentAmount={currentAmount}
      threshold={threshold}
      className={className}
    />
  )
}
