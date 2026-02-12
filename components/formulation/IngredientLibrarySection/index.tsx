'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { IngredientItem } from './IngredientItem'

import { Link } from '@/components/common/Link'
import { INGREDIENTS_DATA } from '@/constants'
import { Routes } from '@/types/enums/routes'
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
          Not all ingredients are in each recipe. View our{' '}
          <Link href={Routes.recipes} variant="secondary" size="small">
            recipe science
          </Link>{' '}
          page to see a breakdown of each formulation.
        </p>

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
