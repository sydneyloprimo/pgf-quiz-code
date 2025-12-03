'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { CheckIcon } from '@/components/common/Icon'
import { InputDropdown } from '@/components/common/InputDropdown'
import { cn } from '@/utils/cn'

interface Benefit {
  icon?: 'check' | 'shipping'
  text: string
}

interface DropdownOption {
  label: string
  value: string
}

interface OptionSelectProductProps {
  isSelected: boolean
  onSelect: () => void
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  isMostPopular?: boolean
  recipeOptions: DropdownOption[]
  recipeValue?: string
  onRecipeSelect?: (value: string) => void
  shipmentFrequencyOptions: DropdownOption[]
  shipmentFrequencyValue?: string
  onShipmentFrequencySelect?: (value: string) => void
  benefits: Benefit[]
  pricePerDay: number
  onDetailsClick?: () => void
  onSubscribeClick?: () => void
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
  recipeOptions,
  recipeValue,
  onRecipeSelect,
  shipmentFrequencyOptions,
  shipmentFrequencyValue,
  onShipmentFrequencySelect,
  benefits,
  pricePerDay,
  onDetailsClick,
  onSubscribeClick,
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

  const handleDetailsClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDetailsClick?.()
    },
    [onDetailsClick]
  )

  const handleSubscribeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSubscribeClick?.()
    },
    [onSubscribeClick]
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
      {isMostPopular && (
        <div
          className={cn(
            'absolute top-0 left-4 -translate-y-1/2',
            'bg-secondary-600 text-neutral-white',
            'px-3 py-1 rounded-full',
            'text-sm font-semibold'
          )}
        >
          {t('mostPopular')}
        </div>
      )}

      <button
        type="button"
        onClick={handleRadioClick}
        className={cn(
          'absolute top-4 right-4',
          'flex items-center justify-center',
          'size-6 rounded-full',
          'border-2 transition-colors',
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
        <div className="flex flex-row items-start gap-4 mb-6">
          <div className="relative size-32 shrink-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain rounded-full"
              sizes="128px"
            />
            <div className="absolute bottom-0 right-0">
              <Image
                src="/images/animal-welfare-certified.png"
                alt={t('animalWelfareCertified')}
                width={60}
                height={70}
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="text-2xl mb-2 font-serif">{title}</h3>
            <p className="text-base text-secondary-950 font-sans">
              {description}
            </p>
          </div>
        </div>

        {isSelected && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-800">
                {t('recipeLabel')}
              </label>
              <InputDropdown
                value={recipeValue}
                placeholder={t('recipePlaceholder')}
                options={recipeOptions}
                onSelect={onRecipeSelect}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-800">
                {t('shipmentFrequencyLabel')}
              </label>
              <InputDropdown
                value={shipmentFrequencyValue}
                placeholder={t('shipmentFrequencyPlaceholder')}
                options={shipmentFrequencyOptions}
                onSelect={onShipmentFrequencySelect}
              />
            </div>

            <div
              className={cn(
                'flex flex-col gap-3',
                'bg-secondary-100 rounded-lg',
                'p-4 mt-2'
              )}
            >
              <h4 className="text-base font-semibold text-neutral-800">
                {t('whatYoullGetTitle')}
              </h4>
              <ul className="flex flex-col gap-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="relative shrink-0 size-6 mt-0.5">
                      {benefit.icon === 'shipping' ? (
                        <div className="size-6 rounded bg-secondary-600 flex items-center justify-center">
                          <svg
                            className="size-4 text-neutral-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      ) : (
                        <CheckIcon className="size-6 text-secondary-600" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 flex-1">
                      {benefit.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-row gap-3 mt-2">
              <Button
                variant="tertiary"
                onClick={handleDetailsClick}
                className="flex"
              >
                {t('detailsButton')}
              </Button>
              <Button
                variant="primary"
                onClick={handleSubscribeClick}
                className="flex-1"
              >
                {t('subscribeButton', { price: pricePerDay.toFixed(2) })}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { OptionSelectProduct }
export type { OptionSelectProductProps, Benefit, DropdownOption }
