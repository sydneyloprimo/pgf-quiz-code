import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { useRecipes } from '@/components/recipes/RecipesContext'
import { BENEFIT_KEYS } from '@/constants'

const RecipeThreeInfo = () => {
  const t = useTranslations('Recipes.Detail')
  const { activeRecipe } = useRecipes()

  const recipeDescription = useMemo(() => {
    const descriptionKey = `${activeRecipe}Description` as const
    return t(descriptionKey)
  }, [activeRecipe, t])

  const recipeImageAlt = useMemo(() => {
    const imageAltKey = `${activeRecipe}ImageAlt` as const
    return t(imageAltKey)
  }, [activeRecipe, t])

  const recipeIngredientsList = useMemo(() => {
    const ingredientsKey = `${activeRecipe}IngredientsList` as const
    return t(ingredientsKey)
  }, [activeRecipe, t])

  const benefits = useMemo(
    () =>
      BENEFIT_KEYS.map((key, i) => ({
        id: `benefit-${i + 1}`,
        text: t(key),
      })),
    [t]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-8">
      {/* Left Column - Recipe Image */}
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-square">
          <Image
            src={`/images/recipes/recipe-bowl-${activeRecipe}.png`}
            alt={recipeImageAlt}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Column - Recipe Info */}
      <div className="flex flex-col gap-6">
        {/* Complete and Balanced Formula */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800">
            {t('subtitle')}
          </h3>
          <p className="font-sans text-base leading-relaxed text-neutral-800">
            {recipeDescription}
          </p>
        </div>

        <hr className="border-tertiary-800" />

        {/* Benefits */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800">
            {t('benefitsTitle')}
          </h3>
          <div className="flex flex-col gap-2">
            {benefits.map((benefit) => (
              <p
                key={benefit.id}
                className="font-sans text-sm text-neutral-800 leading-relaxed"
              >
                {benefit.text}
              </p>
            ))}
          </div>
        </div>

        <hr className="border-tertiary-800" />

        {/* Ingredients */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800">
            {t('ingredientsTitle')}
          </h3>
          <p className="font-sans text-sm text-neutral-800 leading-relaxed">
            {recipeIngredientsList}
          </p>
        </div>
      </div>
    </div>
  )
}

export { RecipeThreeInfo }
