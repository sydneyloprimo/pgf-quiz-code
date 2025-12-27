'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { MinusIcon, PlusIcon } from '@/components/common/Icon'
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
}: IngredientItemProps) => {
  const handleToggle = useCallback(() => {
    onToggle()
  }, [onToggle])

  return (
    <div
      className={cn(
        'w-full',
        'border-b border-tertiary-200',
        isOpen && 'bg-neutral-200 border border-quaternary-200'
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full',
          'py-6 px-6',
          'flex items-center justify-between',
          'text-left'
        )}
        aria-expanded={isOpen}
        aria-label={toggleAriaLabel}
      >
        <div className="flex items-center gap-5">
          <Image
            src={iconSrc}
            alt=""
            width={25}
            height={28}
            className="w-[25px] h-7"
            aria-hidden="true"
          />
          <h3
            className={cn(
              'font-display',
              'text-2xl leading-8',
              'font-bold',
              'text-quaternary-800'
            )}
          >
            {name}
          </h3>
        </div>
        {isOpen ? (
          <MinusIcon className="w-6 h-6 text-quaternary-800" />
        ) : (
          <PlusIcon className="w-6 h-6 text-quaternary-800" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p
            className={cn(
              'font-sans',
              'text-lg leading-7',
              'font-normal',
              'text-secondary-950'
            )}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  )
}

const IngredientLibrarySection = () => {
  const t = useTranslations('Formulation.Ingredients')
  const [openIndex, setOpenIndex] = useState(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  const ingredients = [
    {
      iconSrc: '/icons/basil-icon.svg',
      name: t('basil.name'),
      description: t('basil.description'),
    },
    {
      iconSrc: '/icons/pumpkin-icon.svg',
      name: t('pumpkin.name'),
      description: t('pumpkin.description'),
    },
    {
      iconSrc: '/icons/turmeric-icon.svg',
      name: t('turmeric.name'),
      description: t('turmeric.description'),
    },
    {
      iconSrc: '/icons/pumpkin-icon.svg',
      name: t('avocado.name'),
      description: t('avocado.description'),
    },
    {
      iconSrc: '/icons/raspberry-icon.svg',
      name: t('raspberry.name'),
      description: t('raspberry.description'),
    },
    {
      iconSrc: '/icons/lamb-icon.svg',
      name: t('lamb.name'),
      description: t('lamb.description'),
    },
    {
      iconSrc: '/icons/soybeans-icon.svg',
      name: t('soybeans.name'),
      description: t('soybeans.description'),
    },
  ]

  return (
    <section
      className={cn(
        'w-full',
        'px-5 py-14',
        'tablet:px-24 tablet:pt-24 tablet:pb-36',
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
            'mb-[22px]'
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
