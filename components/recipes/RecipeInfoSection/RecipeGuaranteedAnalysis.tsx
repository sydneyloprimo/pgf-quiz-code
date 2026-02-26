'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { RichTextTableRenderer } from '@/components/common/RichTextTableRenderer'
import {
  type RecipeType,
  useRecipes,
} from '@/components/recipes/RecipesContext'

const INTRO_KEYS: Record<
  RecipeType,
  'lambIntro' | 'seafoodIntro' | 'turkeyIntro'
> = {
  lamb: 'lambIntro',
  seafood: 'seafoodIntro',
  turkey: 'turkeyIntro',
}

const RecipeGuaranteedAnalysis = () => {
  const t = useTranslations('Recipes.GuaranteedAnalysis')
  const { activeRecipe, tables } = useRecipes()

  const tableDoc = useMemo(
    () => tables[activeRecipe]?.guaranteedAnalysis,
    [activeRecipe, tables]
  )

  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-4">
        {t('title')}
      </h2>
      <p className="font-sans text-base leading-relaxed text-neutral-800 mb-6">
        {t(INTRO_KEYS[activeRecipe])}
      </p>

      {tableDoc && <RichTextTableRenderer content={tableDoc} />}
    </div>
  )
}

export { RecipeGuaranteedAnalysis }
