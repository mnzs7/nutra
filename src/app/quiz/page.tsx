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
    question: 'Qual é o seu principal objetivo de saúde?',
    subtitle: 'Selecione o objetivo que melhor descreve o que procura alcançar',
    field: 'goal' as const,
    options: [
      { value: 'muscle_gain', label: 'Ganho Muscular', description: 'Aumentar massa muscular e força', icon: '💪' },
      { value: 'weight_loss', label: 'Perda de Peso', description: 'Reduzir gordura corporal', icon: '⚖️' },
      { value: 'energy', label: 'Mais Energia', description: 'Combater o cansaço e fadiga', icon: '⚡' },
      { value: 'immunity', label: 'Imunidade', description: 'Fortalecer o sistema imunitário', icon: '🛡️' },
      { value: 'sleep', label: 'Melhor Sono', description: 'Adormecer mais fácil e dormir melhor', icon: '🌙' },
      { value: 'general_health', label: 'Saúde Geral', description: 'Bem-estar e saúde preventiva', icon: '🌿' },
    ],
  },
  {
    id: 2,
    question: 'Qual é o seu tipo de alimentação?',
    subtitle: 'Isto ajuda-nos a recomendar suplementos compatíveis com a sua dieta',
    field: 'diet' as const,
    options: [
      { value: 'omnivore', label: 'Omnívoro', description: 'Como de tudo, incluindo carne e peixe', icon: '🍗' },
      { value: 'vegetarian', label: 'Vegetariano', description: 'Não como carne, mas consumo lacticínios/ovos', icon: '🥗' },
      { value: 'vegan', label: 'Vegano', description: 'Alimentação 100% de origem vegetal', icon: '🌱' },
      { value: 'gluten_free', label: 'Sem Glúten', description: 'Alimentação sem glúten (intolerância ou opção)', icon: '🌾' },
    ],
  },
  {
    id: 3,
    question: 'Qual é o seu nível de atividade física?',
    subtitle: 'A sua rotina de exercício influencia as suas necessidades nutricionais',
    field: 'activityLevel' as const,
    options: [
      { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício', icon: '🪑' },
      { value: 'light', label: 'Leve', description: '1-3 dias de exercício por semana', icon: '🚶' },
      { value: 'moderate', label: 'Moderado', description: '3-5 dias de exercício por semana', icon: '🏃' },
      { value: 'active', label: 'Ativo', description: '6-7 dias de exercício por semana', icon: '🏋️' },
      { value: 'very_active', label: 'Muito Ativo', description: 'Atleta ou exercício intenso diário', icon: '🏆' },
    ],
  },
  {
    id: 4,
    question: 'Qual a sua faixa etária?',
    subtitle: 'As necessidades nutricionais variam com a idade',
    field: 'age' as const,
    options: [
      { value: '18-25', label: '18-25 anos', description: 'Crescimento e pico de performance', icon: '🌟' },
      { value: '26-35', label: '26-35 anos', description: 'Manutenção e produtividade', icon: '✨' },
      { value: '36-45', label: '36-45 anos', description: 'Vitalidade e prevenção', icon: '⭐' },
      { value: '46-55', label: '46-55 anos', description: 'Bem-estar e saúde articular', icon: '💫' },
      { value: '56+', label: '56+ anos', description: 'Longevidade e saúde óssea', icon: '🌺' },
    ],
  },
  {
    id: 5,
    question: 'Qual o seu sexo biológico?',
    subtitle: 'Alguns suplementos têm formulações específicas por sexo',
    field: 'gender' as const,
    options: [
      { value: 'male', label: 'Masculino', description: '', icon: '♂️' },
      { value: 'female', label: 'Feminino', description: '', icon: '♀️' },
      { value: 'other', label: 'Prefiro não dizer', description: '', icon: '⭕' },
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
          ing.toLowerCase().includes('peixe') ||
          ing.toLowerCase().includes('leite') ||
          ing.toLowerCase().includes('whey') ||
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
            A analisar o seu perfil...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Estamos a cruzar as suas respostas com a nossa base de dados para encontrar
            os suplementos ideais para si.
          </p>
          <div className="mt-8 space-y-2 max-w-xs mx-auto">
            {['Analisando objetivos...', 'Verificando dieta...', 'Personalizando recomendações...'].map(
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
                As Suas Recomendações Personalizadas
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Com base no seu perfil, estes são os suplementos que mais se adequam
                aos seus objetivos e necessidades:
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
                  Não encontrámos recomendações específicas. Explore os nossos produtos!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleRestart}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Refazer o Quiz
              </Button>
              <Link href="/products">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Ver Todos os Produtos
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
            Quiz de Saúde Personalizado
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Responda a {totalSteps} perguntas para receber recomendações personalizadas
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Questão {currentStep + 1} de {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% completo</span>
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
