'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { IngredientItem } from './IngredientItem'

import { INGREDIENT_CATEGORIES } from '@/constants'
import { cn } from '@/utils/cn'

const IngredientLibrarySection = () => {
  const t = useTranslations('Formulation.Ingredients')
  const [openIndexes, setOpenIndexes] = useState<number[]>(() =>
    INGREDIENT_CATEGORIES.map((_, index) => (index === 0 ? 0 : -1))
  )

  const handleToggle = useCallback(
    (categoryIndex: number, itemIndex: number) => {
      setOpenIndexes((prev) =>
        prev.map((openIndex, index) =>
          index === categoryIndex
            ? openIndex === itemIndex
              ? -1
              : itemIndex
            : openIndex
        )
      )
    },
    []
  )

  const categories = useMemo(
    () =>
      INGREDIENT_CATEGORIES.map((category) => ({
        title: t(category.titleKey),
        items: category.items.map((ingredient) => ({
          iconSrc: ingredient.iconSrc,
          name: t(ingredient.nameKey),
          description: t(ingredient.descriptionKey),
        })),
      })),
    [t]
  )

  return (
    <section
      className={cn(
        'w-full',
        'px-5 py-14',
        'md:px-24 md:pt-24 md:pb-36',
        'bg-neutral-100'
      )}
    >
      <div className="w-full">
        <h2
          className={cn(
            'font-display',
            'text-[2.5rem] leading-12',
            'font-semibold',
            'text-quaternary-800',
            'mb-6'
          )}
        >
          {t('title')}
        </h2>

        <div className="flex flex-col gap-16">
          {categories.map((category, categoryIndex) => (
            <div className="flex flex-col" key={category.title}>
              <h3 className="font-display text-2xl leading-8 font-semibold text-quaternary-800 mb-4 italic">
                {category.title}
              </h3>
              <div className="flex flex-col">
                {category.items.map((ingredient, itemIndex) => (
                  <IngredientItem
                    key={`${category.title}-${ingredient.name}`}
                    name={ingredient.name}
                    description={ingredient.description}
                    isOpen={openIndexes[categoryIndex] === itemIndex}
                    onToggle={() => handleToggle(categoryIndex, itemIndex)}
                    toggleAriaLabel={t('toggleAria')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { IngredientLibrarySection }
