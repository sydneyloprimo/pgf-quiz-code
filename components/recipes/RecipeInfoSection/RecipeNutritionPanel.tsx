'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useId, useMemo, useState } from 'react'

import { RichTextTableRenderer } from '@/components/common/RichTextTableRenderer'
import {
  useRecipes,
  type RecipeTableData,
} from '@/components/recipes/RecipesContext'
import { NUTRITION_PANEL_SECTIONS } from '@/constants'

const TABLE_FIELD_MAP: Record<string, keyof RecipeTableData> = {
  minerals: 'minerals',
  vitamins: 'vitamins',
  fats: 'fats',
  aminoAcids: 'aminoAcids',
}

const RecipeNutritionPanel = () => {
  const t = useTranslations('Recipes.NutritionPanel')
  const { activeRecipe, tables } = useRecipes()
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const baseId = useId()

  const handleToggle = useCallback((sectionId: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }, [])

  const handleSectionButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const sectionId = e.currentTarget.getAttribute('data-section-id')
      if (sectionId) {
        handleToggle(sectionId)
      }
    },
    [handleToggle]
  )

  const recipeTableData = useMemo(
    () => tables[activeRecipe],
    [activeRecipe, tables]
  )

  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-6">
        {t('title')}
      </h2>

      <div className="flex flex-col gap-6">
        {NUTRITION_PANEL_SECTIONS.map((section) => {
          const isOpen = openItems.has(section.id)
          const headingId = `${baseId}-${section.id}-heading`
          const panelId = `${baseId}-${section.id}-panel`
          const fieldKey = TABLE_FIELD_MAP[section.id]
          const tableDoc = fieldKey ? recipeTableData?.[fieldKey] : null

          return (
            <div key={section.id} className="border-b-2 border-tertiary-800">
              <div className="flex items-center justify-between py-2">
                <h3
                  id={headingId}
                  className="font-sans text-base font-bold leading-normal text-tertiary-800 m-0"
                >
                  {t(section.titleKey)}
                </h3>
                <button
                  type="button"
                  onClick={handleSectionButtonClick}
                  data-section-id={section.id}
                  className="flex items-center justify-center p-1 cursor-pointer bg-transparent border-0 text-tertiary-800 text-lg font-light"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={t(
                    isOpen ? 'collapseAriaLabel' : 'expandAriaLabel',
                    {
                      section: t(section.titleKey),
                    }
                  )}
                >
                  {isOpen ? '−' : '+'}
                </button>
              </div>
              {isOpen && (
                <div id={panelId} className="pb-4" aria-labelledby={headingId}>
                  <p className="font-sans text-base leading-relaxed text-black mb-4">
                    {t(section.subheadKey)}
                  </p>
                  {tableDoc && <RichTextTableRenderer content={tableDoc} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { RecipeNutritionPanel }
