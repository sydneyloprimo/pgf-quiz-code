'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo } from 'react'

import { RecipeType, useRecipes } from '@/components/recipes/RecipesContext'
import {
  FEATURE_FLAG_LAMB,
  FEATURE_FLAG_PANCREATIC,
  RECIPE_TABS,
} from '@/constants'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { cn } from '@/utils/cn'

const RecipeTabsSection = () => {
  const t = useTranslations('Recipes.Tabs')
  const { activeRecipe, setActiveRecipe } = useRecipes()
  const lambEnabled = useFeatureFlag(FEATURE_FLAG_LAMB)
  const pancreaticEnabled = useFeatureFlag(FEATURE_FLAG_PANCREATIC)

  const visibleTabs = useMemo(
    () =>
      RECIPE_TABS.filter(
        (r) =>
          (r !== 'lamb' || lambEnabled) &&
          (r !== 'seafood' || pancreaticEnabled)
      ),
    [lambEnabled, pancreaticEnabled]
  )

  useEffect(() => {
    if (
      (activeRecipe === 'lamb' && !lambEnabled) ||
      (activeRecipe === 'seafood' && !pancreaticEnabled)
    ) {
      setActiveRecipe('turkey')
    }
  }, [activeRecipe, lambEnabled, pancreaticEnabled, setActiveRecipe])

  const handleTabClick = useCallback(
    (recipe: RecipeType) => {
      setActiveRecipe(recipe)
    },
    [setActiveRecipe]
  )

  return (
    <section className="w-full bg-neutral-100 px-5 md:px-24">
      <div className="max-w-4xl mx-auto">
        <nav
          className="flex items-center justify-center gap-8 md:gap-16"
          role="tablist"
          aria-label={t('recipeTabs')}
        >
          {visibleTabs.map((recipe) => {
            const isActive = activeRecipe === recipe
            const handleClick = () => handleTabClick(recipe)
            return (
              <button
                key={recipe}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`recipe-panel-${recipe}`}
                onClick={handleClick}
                className={cn(
                  'py-4 px-2',
                  'font-display',
                  'cursor-pointer',
                  'border-b-2 -mb-px',
                  'transition-colors duration-200',
                  isActive
                    ? 'text-secondary-600 border-secondary-600 text-2xl md:text-4xl'
                    : 'text-neutral-700 border-transparent hover:text-secondary-500 text-lg md:text-xl'
                )}
              >
                {t(recipe)}
              </button>
            )
          })}
        </nav>
      </div>
    </section>
  )
}

export { RecipeTabsSection }
