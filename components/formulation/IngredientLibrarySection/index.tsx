'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { IngredientItem } from './IngredientItem'

import { Link } from '@/components/common/Link'
import {
  FORMULATION_SECTION_PADDING_X,
  FORMULATION_SECTION_PADDING_Y,
  INGREDIENT_CATEGORIES,
} from '@/constants'
import { Routes } from '@/types/enums/routes'
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
        FORMULATION_SECTION_PADDING_X,
        FORMULATION_SECTION_PADDING_Y,
        'bg-neutral-100'
      )}
    >
      <div className="w-full">
        <h2
          className={cn(
            'heading-h2',
            'tracking-tight',
            'text-quaternary-800',
            'not-italic',
            'mb-6'
          )}
        >
          {t('title')}
        </h2>
        <p className="font-sans text-lg leading-normal text-quaternary-800 py-2 mb-8">
          {t.rich('description', {
            recipeBreakdowns: (chunks) => (
              <Link
                href={Routes.recipes}
                className="text-lg leading-normal font-normal text-quaternary-800 underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>

        <div className="flex flex-col gap-16">
          {categories.map((category, categoryIndex) => (
            <div className="flex flex-col" key={category.title}>
              <h3 className="font-display text-2xl leading-8 text-quaternary-800 mb-4">
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
