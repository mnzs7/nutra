import { cn } from '@/lib/utils/cn'
import type { NutritionFact } from '@/lib/types'

interface NutritionFactsProps {
  facts: NutritionFact[]
  servingSize: string
  servings: number
  className?: string
}

export function NutritionFacts({
  facts,
  servingSize,
  servings,
  className,
}: NutritionFactsProps) {
  return (
    <div
      className={cn(
        'border-2 border-gray-900 dark:border-gray-100 p-4 rounded-lg max-w-sm',
        'font-sans',
        className
      )}
      role="region"
      aria-label="Información nutricional"
    >
      <h3 className="text-2xl font-black text-gray-900 dark:text-white border-b-8 border-gray-900 dark:border-gray-100 pb-1 mb-1">
        Información Nutricional
      </h3>

      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 border-b border-gray-400 pb-1 mb-1">
        Dosis diaria sugerida: {servingSize}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400 border-b-4 border-gray-900 dark:border-gray-100 pb-2 mb-1">
        Aproximadamente {servings} dosis por envase
      </p>

      <div className="text-right text-xs font-bold text-gray-700 dark:text-gray-300 border-b border-gray-400 pb-1 mb-0">
        Cantidad por dosis
      </div>
      <div className="text-right text-xs text-gray-600 dark:text-gray-400 border-b-4 border-gray-900 dark:border-gray-100 pb-1 mb-1">
        % VRN*
      </div>

      <table className="w-full text-xs" aria-label="Tabela nutricional">
        <thead className="sr-only">
          <tr>
            <th scope="col">Nutriente</th>
            <th scope="col">Cantidad por dosis</th>
            <th scope="col">Valor de referencia nutricional</th>
          </tr>
        </thead>
        <tbody>
          {facts.map((fact, index) => (
            <tr
              key={index}
              className={cn(
                'border-b border-gray-300 dark:border-gray-700',
                fact.name.startsWith('de los cuales') || fact.name.startsWith('of which')
                  ? 'pl-4'
                  : ''
              )}
            >
              <td
                className={cn(
                  'py-1 font-medium text-gray-900 dark:text-white',
                  (fact.name.startsWith('de los cuales') || fact.name.startsWith('of which')) &&
                    'pl-3 font-normal'
                )}
              >
                {fact.name}
              </td>
              <td className="py-1 text-right font-bold text-gray-900 dark:text-white">
                {fact.amount}
              </td>
              <td className="py-1 text-right text-gray-700 dark:text-gray-300 w-12">
                {fact.dailyValue || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
        *VRN = Valor de Referencia Nutricional para adultos (8400 kJ / 2000 kcal).
        {' '}** = VRN no establecido.
      </p>
    </div>
  )
}
