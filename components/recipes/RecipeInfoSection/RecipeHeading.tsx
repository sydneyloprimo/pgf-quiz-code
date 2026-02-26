import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { useRecipes } from '@/components/recipes/RecipesContext'

const RecipeHeading = () => {
  const t = useTranslations('Recipes.Detail')
  const { activeRecipe } = useRecipes()

  const recipeTitle = useMemo(() => {
    const titleKey = `${activeRecipe}Title` as const
    return t(titleKey)
  }, [activeRecipe, t])

  return (
    <div className="mb-8 text-center">
      <h1 className="font-display text-4xl font-normal leading-normal text-tertiary-800">
        {recipeTitle}
      </h1>
    </div>
  )
}

export { RecipeHeading }
