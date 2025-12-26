'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { ChevronIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface IngredientItemProps {
  iconSrc: string
  name: string
  description: string
  isOpen: boolean
  onToggle: () => void
  toggleAriaLabel: string
}

const IngredientItem = ({
  iconSrc,
  name,
  description,
  isOpen,
  onToggle,
  toggleAriaLabel,
}: IngredientItemProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      'w-full',
      'border-b border-tertiary-200',
      'py-6',
      'flex flex-col gap-4',
      'text-left'
    )}
    aria-expanded={isOpen}
    aria-label={toggleAriaLabel}
  >
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Image
          src={iconSrc}
          alt=""
          width={48}
          height={48}
          className="w-12 h-12"
          aria-hidden="true"
        />
        <h3
          className={cn(
            'font-display',
            'text-lg md:text-xl',
            'text-secondary-950'
          )}
        >
          {name}
        </h3>
      </div>
      <ChevronIcon
        direction={isOpen ? 'up' : 'down'}
        className="w-5 h-5 text-secondary-700"
      />
    </div>
    {isOpen && (
      <p
        className={cn(
          'font-sans text-base leading-relaxed',
          'text-secondary-700',
          'pl-16'
        )}
      >
        {description}
      </p>
    )}
  </button>
)

const IngredientLibrarySection = () => {
  const t = useTranslations('Formulation.Ingredients')
  const [openIndex, setOpenIndex] = useState(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  const ingredients = [
    {
      iconSrc: '/images/formulation/icon-basil.svg',
      name: t('basil.name'),
      description: t('basil.description'),
    },
    {
      iconSrc: '/images/formulation/icon-pumpkin.svg',
      name: t('pumpkin.name'),
      description: t('pumpkin.description'),
    },
    {
      iconSrc: '/images/formulation/icon-turmeric.svg',
      name: t('turmeric.name'),
      description: t('turmeric.description'),
    },
    {
      iconSrc: '/images/formulation/icon-avocado.svg',
      name: t('avocado.name'),
      description: t('avocado.description'),
    },
    {
      iconSrc: '/images/formulation/icon-raspberry.svg',
      name: t('raspberry.name'),
      description: t('raspberry.description'),
    },
    {
      iconSrc: '/images/formulation/icon-lamb.svg',
      name: t('lamb.name'),
      description: t('lamb.description'),
    },
    {
      iconSrc: '/images/formulation/icon-soybeans.svg',
      name: t('soybeans.name'),
      description: t('soybeans.description'),
    },
  ]

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-24 desktop:px-32',
        'py-16 md:py-24',
        'bg-neutral-100'
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 text-center">
          <h2
            className={cn(
              'font-display',
              'text-3xl md:text-4xl desktop:text-5xl',
              'leading-tight',
              'text-secondary-950'
            )}
          >
            {t('title')}
          </h2>
          <p
            className={cn(
              'font-sans',
              'text-base md:text-lg',
              'leading-relaxed',
              'text-secondary-700'
            )}
          >
            {t('description')}
          </p>
        </div>

        {/* Ingredient List */}
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
