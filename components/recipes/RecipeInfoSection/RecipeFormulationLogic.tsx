'use client'

import { useTranslations } from 'next-intl'

import { useRecipes } from '@/components/recipes/RecipesContext'
import { FORMULATION_CARDS } from '@/constants'

const RecipeFormulationLogic = () => {
  const t = useTranslations('Recipes.FormulationLogic')
  const { activeRecipe } = useRecipes()

  const recipePrefix = `${activeRecipe}.`

  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-6">
        {t('title')}
      </h2>

      <div className="flex flex-col gap-4">
        {FORMULATION_CARDS.map((card) => (
          <div key={card.id} className="flex overflow-hidden bg-neutral-100">
            <div className="w-1 bg-tertiary-800 shrink-0" />
            <div className="p-6 flex-1">
              <p className="font-sans text-base font-normal leading-normal text-black">
                <span className="font-bold">
                  {t(`${recipePrefix}${card.titleKey}`)}
                </span>{' '}
                {t(`${recipePrefix}${card.descriptionKey}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { RecipeFormulationLogic }
