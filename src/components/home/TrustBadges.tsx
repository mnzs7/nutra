import { Shield, Truck, RotateCcw, Headphones, Award, Lock } from 'lucide-react'

const badges = [
  {
    Icon: Shield,
    title: 'Productos Certificados',
    description: 'GMP, ISO 9001 y AESAN',
    color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
  },
  {
    Icon: Truck,
    title: 'Envío Rápido',
    description: '24-48h en España peninsular',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    Icon: RotateCcw,
    title: 'Devolución Gratuita',
    description: '30 días sin preguntas',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
  {
    Icon: Headphones,
    title: 'Soporte Especializado',
    description: 'Nutricionistas disponibles',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  },
  {
    Icon: Award,
    title: 'Programa de Puntos',
    description: '€1 = 1 punto de fidelidad',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  },
  {
    Icon: Lock,
    title: 'Pago Seguro',
    description: 'SSL, Bizum y 3D Secure',
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  },
]

export function TrustBadges() {
  return (
    <section
      className="py-12 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800"
      aria-label="Por qué elegir VitaShop"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map(({ Icon, title, description, color }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2 p-3"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                  {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
