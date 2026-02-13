'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { NUTRITION_PANEL_ACCORDION_ITEMS } from '@/constants'

const RecipeNutritionPanel = () => {
  const t = useTranslations('Recipes.NutritionPanel')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const handleToggle = useCallback((itemId: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }, [])

  return (
    <div className="mb-8">
      <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-6">
        {t('title')}
      </h3>

      <div className="flex flex-col gap-6">
        {NUTRITION_PANEL_ACCORDION_ITEMS.map((item) => {
          const isOpen = openItems.has(item.id)
          return (
            <div key={item.id} className="border-b-2 border-tertiary-800">
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                className="w-full flex items-center justify-between py-2 text-left cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                aria-label={t(
                  isOpen ? 'collapseAriaLabel' : 'expandAriaLabel',
                  {
                    section: t(item.titleKey),
                  }
                )}
              >
                <span className="font-sans text-base font-bold leading-normal text-tertiary-800">
                  {t(item.titleKey)}
                </span>
                <span className="text-tertiary-800 text-lg font-light">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div id={`panel-${item.id}`} className="pb-4 text-neutral-700">
                  <p className="font-sans text-sm leading-relaxed">
                    {t(`${item.id}Content`)}
                  </p>
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
