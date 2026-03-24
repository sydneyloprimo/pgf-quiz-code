'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { OptionSelectProductBenefits } from './OptionSelectProductBenefits'
import { OptionSelectProductBenefitsAlaCarte } from './OptionSelectProductBenefitsAlaCarte'
import { OptionSelectProductCTAs } from './OptionSelectProductCTAs'
import { OptionSelectProductDropdowns } from './OptionSelectProductDropdowns'
import { OptionSelectProductDropdownsAlaCarte } from './OptionSelectProductDropdownsAlaCarte'
import { OptionSelectProductHeader } from './OptionSelectProductHeader'

import { cn } from '@/utils/cn'

export type { Benefit } from './OptionSelectProductBenefits'
export type { DropdownOption } from './OptionSelectProductDropdowns'

interface OptionSelectProductProps {
  isSelected: boolean
  onSelect: () => void
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  isMostPopular?: boolean
  isAlaCarte?: boolean
  recipeOptions: Array<{ label: string; value: string }>
  recipeValue?: string
  onRecipeSelect?: (value: string) => void
  shipmentFrequencyOptions?: Array<{ label: string; value: string }>
  shipmentFrequencyValue?: string
  onShipmentFrequencySelect?: (value: string) => void
  benefits: Array<{ icon?: 'check' | 'shipping'; text: string }>
  pricePerDay?: number
  onSubscribeClick?: () => void
  onAddToCartClick?: () => void
  subscribeButtonDisabled?: boolean
  subscribeButtonText?: string
  className?: string
}

const OptionSelectProduct = ({
  isSelected,
  onSelect,
  title,
  description,
  imageSrc,
  imageAlt,
  isMostPopular = false,
  isAlaCarte = false,
  recipeOptions,
  recipeValue,
  onRecipeSelect,
  shipmentFrequencyOptions,
  shipmentFrequencyValue,
  onShipmentFrequencySelect,
  benefits,
  pricePerDay,
  onSubscribeClick,
  onAddToCartClick,
  subscribeButtonDisabled,
  subscribeButtonText,
  className,
}: OptionSelectProductProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  const handleCardClick = useCallback(() => {
    if (!isSelected) {
      onSelect()
    }
  }, [isSelected, onSelect])

  const handleRadioClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect()
    },
    [onSelect]
  )

  return (
    <div
      className={cn(
        'relative flex flex-col',
        'border transition-colors',
        'hover:bg-secondary-100',
        isSelected
          ? 'bg-secondary-100 border-secondary-600 border-2'
          : 'bg-neutral-white border-tertiary-300',
        className
      )}
      onClick={handleCardClick}
    >
      <button
        type="button"
        onClick={handleRadioClick}
        className={cn(
          'absolute top-4 right-4',
          'flex items-center justify-center',
          'size-6 rounded-full',
          'border-2 transition-colors',
          'cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-600',
          isSelected
            ? 'bg-secondary-600 border-secondary-600'
            : 'bg-neutral-white border-secondary-600'
        )}
        aria-label={t('selectOption', { title })}
        aria-pressed={isSelected}
      >
        {isSelected && <div className="size-2 rounded-full bg-neutral-white" />}
      </button>

      <div className="flex flex-col px-4 pt-8 pb-4">
        <OptionSelectProductHeader
          title={title}
          description={description}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          isMostPopular={isMostPopular}
        />

        {isSelected && (
          <div className="w-full flex flex-col gap-4">
            {isAlaCarte ? (
              <OptionSelectProductDropdownsAlaCarte
                recipeOptions={recipeOptions}
                recipeValue={recipeValue}
                onRecipeSelect={onRecipeSelect}
              />
            ) : (
              <OptionSelectProductDropdowns
                recipeOptions={recipeOptions}
                recipeValue={recipeValue}
                onRecipeSelect={onRecipeSelect}
                shipmentFrequencyOptions={shipmentFrequencyOptions || []}
                shipmentFrequencyValue={shipmentFrequencyValue}
                onShipmentFrequencySelect={onShipmentFrequencySelect}
              />
            )}

            {isAlaCarte ? (
              <OptionSelectProductBenefitsAlaCarte benefits={benefits} />
            ) : (
              <OptionSelectProductBenefits
                benefits={benefits}
                shipmentFrequencyValue={shipmentFrequencyValue}
              />
            )}

            <OptionSelectProductCTAs
              pricePerDay={pricePerDay}
              recipeValue={recipeValue}
              onSubscribeClick={onSubscribeClick}
              onAddToCartClick={onAddToCartClick}
              isAlaCarte={isAlaCarte}
              subscribeButtonDisabled={subscribeButtonDisabled}
              subscribeButtonText={subscribeButtonText}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export { OptionSelectProduct }
export type { OptionSelectProductProps }
