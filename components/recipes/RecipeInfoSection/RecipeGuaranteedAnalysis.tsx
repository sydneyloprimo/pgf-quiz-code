'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { useRecipes } from '@/components/recipes/RecipesContext'
import { NUTRIENT_DATA } from '@/constants'
import { cn } from '@/utils/cn'

const RecipeGuaranteedAnalysis = () => {
  const t = useTranslations('Recipes.GuaranteedAnalysis')
  const { activeRecipe } = useRecipes()

  const nutrients = useMemo(
    () => NUTRIENT_DATA[activeRecipe] || NUTRIENT_DATA.turkey,
    [activeRecipe]
  )

  return (
    <div className="mb-8">
      <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-6">
        {t('title')}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-quaternary-50 border border-tertiary-800">
          <thead>
            <tr className="bg-quaternary-200 py-3 px-4 font-sans text-sm font-semibold text-tertiary-800">
              <th className="text-left">{t('nutrientLabel')}</th>
              <th className="text-center">{t('minLabel')}</th>
              <th className="text-center">{t('maxLabel')}</th>
            </tr>
          </thead>
          <tbody>
            {nutrients.map((nutrient, index) => {
              const isLastRow = index === nutrients.length - 1
              return (
                <tr
                  key={nutrient.id}
                  className={cn(
                    'py-3 px-4 font-sans text-sm text-tertiary-800',
                    index % 2 === 0 ? 'bg-white' : 'bg-neutral-100',
                    {
                      'border-b border-tertiary-800': isLastRow,
                      'border-b border-neutral-300': !isLastRow,
                    }
                  )}
                >
                  <td className="text-left">{t(nutrient.nutrientKey)}</td>
                  <td className="text-center">{nutrient.minValue}</td>
                  <td className="text-center">{nutrient.maxValue}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { RecipeGuaranteedAnalysis }
