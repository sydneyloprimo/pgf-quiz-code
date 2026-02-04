'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { RecipeType, useRecipes } from '@/components/recipes/RecipesContext'
import { RECIPE_TABS } from '@/constants'
import { cn } from '@/utils/cn'

const RecipeTabsSection = () => {
  const t = useTranslations('Recipes.Tabs')
  const { activeRecipe, setActiveRecipe } = useRecipes()

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
          {RECIPE_TABS.map((recipe) => {
            const isActive = activeRecipe === recipe
            return (
              <button
                key={recipe}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`recipe-panel-${recipe}`}
                onClick={() => handleTabClick(recipe)}
                className={cn(
                  'py-4 px-2',
                  'font-display',
                  'cursor-pointer',
                  'border-b-2 -mb-px',
                  'transition-colors duration-200',
                  isActive
                    ? 'text-secondary-600 border-secondary-600 text-xl md:text-2xl'
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
