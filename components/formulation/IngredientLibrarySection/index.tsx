'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { IngredientItem } from './IngredientItem'

import { INGREDIENTS_DATA } from '@/constants'
import { cn } from '@/utils/cn'

const IngredientLibrarySection = () => {
  const t = useTranslations('Formulation.Ingredients')
  const [openIndex, setOpenIndex] = useState(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  const ingredients = useMemo(
    () =>
      INGREDIENTS_DATA.map((ingredient) => ({
        iconSrc: ingredient.iconSrc,
        name: t(ingredient.nameKey),
        description: t(ingredient.descriptionKey),
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

        <div className="flex flex-col">
          {ingredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              iconSrc={ingredient.iconSrc}
              name={ingredient.name}
              description={ingredient.description}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              toggleAriaLabel={t('toggleAria')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { IngredientLibrarySection }
