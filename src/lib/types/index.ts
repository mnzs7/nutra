// ============================================================
// PRODUCT TYPES
// ============================================================

export type ProductCategory =
  | 'vitaminas'
  | 'proteina'
  | 'omega3'
  | 'pre-treino'
  | 'sono'
  | 'colageno'

export type ProductBrand =
  | 'VitaMax'
  | 'NutriPure'
  | 'SportLab'
  | 'NaturaBio'
  | 'PowerFit'
  | 'WellnessPlus'

export interface NutritionFact {
  name: string
  amount: string
  dailyValue?: string
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  images: string[]
  category: ProductCategory
  brand: ProductBrand
  rating: number
  reviewsCount: number
  stock: number
  sku: string
  weight: string
  servings: number
  servingSize: string
  nutritionFacts: NutritionFact[]
  ingredients: string[]
  warnings: string[]
  benefits: string[]
  tags: string[]
  isFeatured: boolean
  isNew: boolean
  isBestSeller: boolean
  subscriptionAvailable: boolean
  reviews: Review[]
}

// ============================================================
// CART TYPES
// ============================================================

export type CartItemSubscription = 'once' | 'monthly'

export interface CartItem {
  product: Product
  quantity: number
  subscription: CartItemSubscription
}

export interface Cart {
  items: CartItem[]
  couponCode?: string
  discount?: number
  pointsApplied: number
}

// ============================================================
// CHECKOUT TYPES
// ============================================================

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation'

export interface Address {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface PaymentInfo {
  method: 'credit_card' | 'debit_card' | 'mbway' | 'multibanco' | 'paypal'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  mbwayPhone?: string
}

export interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: CartItem[]
  shipping: Address
  payment: Omit<PaymentInfo, 'cvv'>
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  pointsEarned: number
  trackingCode?: string
}

// ============================================================
// USER TYPES
// ============================================================

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  avatar?: string
  addresses: Address[]
  orders: Order[]
  points: number
  createdAt: string
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  newsletter: boolean
}

// ============================================================
// QUIZ TYPES
// ============================================================

export type QuizGoal =
  | 'muscle_gain'
  | 'weight_loss'
  | 'energy'
  | 'immunity'
  | 'sleep'
  | 'general_health'

export type QuizDiet = 'omnivore' | 'vegetarian' | 'vegan' | 'gluten_free'

export type QuizActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export interface QuizAnswers {
  goal?: QuizGoal
  diet?: QuizDiet
  activityLevel?: QuizActivityLevel
  age?: string
  gender?: 'male' | 'female' | 'other'
}

export interface QuizStep {
  id: number
  question: string
  subtitle?: string
  type: 'single' | 'age'
  field: keyof QuizAnswers
  options?: {
    value: string
    label: string
    description?: string
    icon?: string
  }[]
}

// ============================================================
// FILTER & SORT TYPES
// ============================================================

export interface ProductFilters {
  categories: ProductCategory[]
  brands: ProductBrand[]
  minPrice: number
  maxPrice: number
  rating: number
  inStock: boolean
  isNew: boolean
  isBestSeller: boolean
}

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'newest'
  | 'bestseller'

// ============================================================
// TOAST TYPES
// ============================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

// ============================================================
// POINTS TYPES
// ============================================================

export interface PointsTransaction {
  id: string
  date: string
  description: string
  points: number
  type: 'earned' | 'redeemed'
}

export interface PointsState {
  balance: number
  transactions: PointsTransaction[]
}

// ============================================================
// SEARCH TYPES
// ============================================================

export interface SearchSuggestion {
  id: string
  name: string
  slug: string
  category: ProductCategory
  price: number
  image: string
}

// ============================================================
// CATEGORY META
// ============================================================

export interface CategoryMeta {
  id: ProductCategory
  label: string
  description: string
  icon: string
  color: string
  productCount?: number
}
