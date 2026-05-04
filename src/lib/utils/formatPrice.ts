const PRICE_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value: number): string {
  return PRICE_FORMATTER.format(value)
}

export function calculateDiscountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function formatDiscount(original: number, current: number): string {
  return `-${calculateDiscountPercent(original, current)}%`
}

// Subscription price is 15% off
export function getSubscriptionPrice(price: number): number {
  return Math.round(price * 0.85 * 100) / 100
}

// €1 spent = 1 point earned
export function calculatePoints(total: number): number {
  return Math.floor(total)
}

// 100 points = €1 discount
export function pointsToEuro(points: number): number {
  return points / 100
}

export function euroToPoints(euro: number): number {
  return euro * 100
}
