'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/products/ProductCard'
import { products } from '@/lib/data/products'
import { cn } from '@/lib/utils/cn'
import type { QuizAnswers, QuizGoal, QuizDiet, QuizActivityLevel, Product } from '@/lib/types'

const quizSteps = [
  {
    id: 1,
    question: '¿Cuál es tu principal objetivo de salud?',
    subtitle: 'Selecciona el objetivo que mejor describe lo que buscas conseguir',
    field: 'goal' as const,
    options: [
      { value: 'muscle_gain', label: 'Ganar Músculo', description: 'Aumentar masa muscular y fuerza', icon: '💪' },
      { value: 'weight_loss', label: 'Perder Peso', description: 'Reducir grasa corporal', icon: '⚖️' },
      { value: 'energy', label: 'Más Energía', description: 'Combatir el cansancio y la fatiga', icon: '⚡' },
      { value: 'immunity', label: 'Inmunidad', description: 'Reforzar el sistema inmunitario', icon: '🛡️' },
      { value: 'sleep', label: 'Mejor Sueño', description: 'Conciliar el sueño más fácil y dormir mejor', icon: '🌙' },
      { value: 'general_health', label: 'Salud General', description: 'Bienestar y salud preventiva', icon: '🌿' },
    ],
  },
  {
    id: 2,
    question: '¿Cuál es tu tipo de alimentación?',
    subtitle: 'Esto nos ayuda a recomendarte suplementos compatibles con tu dieta',
    field: 'diet' as const,
    options: [
      { value: 'omnivore', label: 'Omnívoro', description: 'Como de todo, incluyendo carne y pescado', icon: '🍗' },
      { value: 'vegetarian', label: 'Vegetariano', description: 'No como carne, pero consumo lácteos/huevos', icon: '🥗' },
      { value: 'vegan', label: 'Vegano', description: 'Alimentación 100% de origen vegetal', icon: '🌱' },
      { value: 'gluten_free', label: 'Sin Gluten', description: 'Alimentación sin gluten (intolerancia u opción)', icon: '🌾' },
    ],
  },
  {
    id: 3,
    question: '¿Cuál es tu nivel de actividad física?',
    subtitle: 'Tu rutina de ejercicio influye en tus necesidades nutricionales',
    field: 'activityLevel' as const,
    options: [
      { value: 'sedentary', label: 'Sedentario', description: 'Poco o ningún ejercicio', icon: '🪑' },
      { value: 'light', label: 'Ligero', description: '1-3 días de ejercicio por semana', icon: '🚶' },
      { value: 'moderate', label: 'Moderado', description: '3-5 días de ejercicio por semana', icon: '🏃' },
      { value: 'active', label: 'Activo', description: '6-7 días de ejercicio por semana', icon: '🏋️' },
      { value: 'very_active', label: 'Muy Activo', description: 'Atleta o ejercicio intenso diario', icon: '🏆' },
    ],
  },
  {
    id: 4,
    question: '¿Cuál es tu rango de edad?',
    subtitle: 'Las necesidades nutricionales varían con la edad',
    field: 'age' as const,
    options: [
      { value: '18-25', label: '18-25 años', description: 'Crecimiento y pico de rendimiento', icon: '🌟' },
      { value: '26-35', label: '26-35 años', description: 'Mantenimiento y productividad', icon: '✨' },
      { value: '36-45', label: '36-45 años', description: 'Vitalidad y prevención', icon: '⭐' },
      { value: '46-55', label: '46-55 años', description: 'Bienestar y salud articular', icon: '💫' },
      { value: '56+', label: '56+ años', description: 'Longevidad y salud ósea', icon: '🌺' },
    ],
  },
  {
    id: 5,
    question: '¿Cuál es tu sexo biológico?',
    subtitle: 'Algunos suplementos tienen formulaciones específicas por sexo',
    field: 'gender' as const,
    options: [
      { value: 'male', label: 'Masculino', description: '', icon: '♂️' },
      { value: 'female', label: 'Femenino', description: '', icon: '♀️' },
      { value: 'other', label: 'Prefiero no decirlo', description: '', icon: '⭕' },
    ],
  },
]

function getRecommendations(answers: QuizAnswers): Product[] {
  const { goal, diet, activityLevel } = answers
  let recommended: Product[] = []

  // Goal-based recommendations
  if (goal === 'muscle_gain') {
    recommended = products.filter((p) =>
      ['proteina', 'pre-treino', 'vitaminas'].includes(p.category)
    )
  } else if (goal === 'weight_loss') {
    recommended = products.filter((p) =>
      ['proteina', 'vitaminas', 'omega3'].includes(p.category)
    )
  } else if (goal === 'energy') {
    recommended = products.filter((p) =>
      ['vitaminas', 'pre-treino'].includes(p.category)
    )
  } else if (goal === 'immunity') {
    recommended = products.filter((p) =>
      ['vitaminas', 'omega3'].includes(p.category)
    )
  } else if (goal === 'sleep') {
    recommended = products.filter((p) => p.category === 'sono')
  } else if (goal === 'general_health') {
    recommended = products.filter((p) =>
      ['vitaminas', 'omega3', 'colageno'].includes(p.category)
    )
  }

  // Diet filter
  if (diet === 'vegan') {
    recommended = recommended.filter(
      (p) =>
        !p.ingredients.some((ing) =>
          ing.toLowerCase().includes('pescado') ||
          ing.toLowerCase().includes('leche') ||
          ing.toLowerCase().includes('suero') ||
          ing.toLowerCase().includes('gelatina') ||
          ing.toLowerCase().includes('bovino')
        )
    )
    // Add vegan omega if needed
    if (goal === 'immunity' || goal === 'general_health') {
      const veganOmega = products.find((p) => p.slug === 'omega3-vegano-algas-wellnessplus')
      if (veganOmega && !recommended.find((p) => p.id === veganOmega.id)) {
        recommended.push(veganOmega)
      }
    }
  }

  // Activity boost
  if (activityLevel === 'active' || activityLevel === 'very_active') {
    const preworkout = products.find((p) => p.category === 'pre-treino')
    if (preworkout && goal !== 'sleep' && !recommended.find((p) => p.id === preworkout.id)) {
      recommended.push(preworkout)
    }
  }

  return recommended.slice(0, 4)
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [completed, setCompleted] = useState(false)

  const step = quizSteps[currentStep]
  const totalSteps = quizSteps.length
  const progress = ((currentStep) / totalSteps) * 100

  const handleSelect = (field: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [field]: value }
    setAnswers(newAnswers)

    if (currentStep < totalSteps - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300)
    } else {
      // Last step - analyze
      setTimeout(async () => {
        setIsAnalyzing(true)
        await new Promise((r) => setTimeout(r, 2500))
        const recs = getRecommendations(newAnswers)
        setRecommendations(recs)
        setIsAnalyzing(false)
        setCompleted(true)
      }, 300)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers({})
    setCompleted(false)
    setRecommendations([])
  }

  const currentAnswer = answers[step?.field as keyof QuizAnswers]

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <div className="mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30"
            >
              <Loader2 className="h-8 w-8 text-primary-600" aria-hidden="true" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            Analizando tu perfil...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Estamos cruzando tus respuestas con nuestra base de datos para encontrar
            los suplementos ideales para ti.
          </p>
          <div className="mt-8 space-y-2 max-w-xs mx-auto">
            {['Analizando objetivos...', 'Verificando dieta...', 'Personalizando recomendaciones...'].map(
              (text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.6 }}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: i * 0.6 + 0.3, duration: 0.3 }}
                  >
                    <Check className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  </motion.div>
                  {text}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                <span className="text-3xl" aria-hidden="true">🎯</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                Tus Recomendaciones Personalizadas
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Según tu perfil, estos son los suplementos que mejor se adaptan
                a tus objetivos y necesidades:
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 mb-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No encontramos recomendaciones específicas. ¡Explora nuestros productos!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleRestart}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Repetir el Test
              </Button>
              <Link href="/products">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Ver Todos los Productos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Test de Salud Personalizado
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Responde {totalSteps} preguntas para recibir recomendaciones personalizadas
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Pregunta {currentStep + 1} de {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% completado</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {step.question}
              </h2>
              {step.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {step.subtitle}
                </p>
              )}

              <fieldset>
                <legend className="sr-only">{step.question}</legend>
                <div className={cn(
                  'grid gap-3',
                  step.options && step.options.length <= 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : step.options && step.options.length === 4
                    ? 'grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                )}>
                  {step.options?.map((option) => {
                    const isSelected = currentAnswer === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(step.field, option.value)}
                        className={cn(
                          'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center',
                          'transition-all duration-200 cursor-pointer',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                          isSelected
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm'
                        )}
                        aria-pressed={isSelected}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" aria-hidden="true" />
                          </div>
                        )}
                        <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                        <span className={cn(
                          'text-sm font-semibold',
                          isSelected
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-900 dark:text-white'
                        )}>
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                            {option.description}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Anterior

          </Button>
          <p className="text-xs text-gray-400">
            {currentStep + 1}/{totalSteps}
          </p>
        </div>
      </div>
    </div>
  )
}
