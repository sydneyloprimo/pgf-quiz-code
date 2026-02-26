'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'

import {
  DecrementIcon,
  IncrementIcon,
  TrashIcon,
} from '@/components/common/Icon'
import { InputDropdown } from '@/components/common/InputDropdown'
import { InputDropdownProvider } from '@/components/common/InputDropdown/InputDropdownContext'
import { InputNumber } from '@/components/common/InputNumber'
import { FEATURE_FLAG_LAMB, FEATURE_FLAG_PANCREATIC } from '@/constants'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import {
  ProductVariant,
  Attribute,
  SellingPlanAllocation,
  CurrencyCode,
} from '@/shopify/generated/graphql'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/helpers'

interface ShoppingCartItemProps {
  productVariant: ProductVariant
  quantity: number
  onDecreaseClick: () => void
  onDeleteClick: () => void
  onIncreaseClick: () => void
  onFrequencyChange?: (frequency: 'weekly' | 'bi-weekly') => void
  onRecipeChange?: (recipe: 'turkey' | 'lamb' | 'pancreatic') => void
  disabled: boolean
  attributes?: Attribute[]
  sellingPlanAllocation?: SellingPlanAllocation | null
  cartLineId?: string
  cost?: {
    totalAmount?: { amount: string; currencyCode: string } | null
  } | null
}

const ShoppingCartItem = ({
  productVariant,
  quantity,
  onDecreaseClick,
  onIncreaseClick,
  onDeleteClick,
  onFrequencyChange,
  onRecipeChange,
  disabled,
  attributes = [],
  sellingPlanAllocation,
  cartLineId,
  cost,
}: ShoppingCartItemProps) => {
  const t = useTranslations('Common.ShoppingCartPanel')
  const lambEnabled = useFeatureFlag(FEATURE_FLAG_LAMB)
  const pancreaticEnabled = useFeatureFlag(FEATURE_FLAG_PANCREATIC)

  const dogNameAttribute = attributes.find(
    (attr) => attr.key === 'Dog Name'
  )?.value

  const portionAttribute = attributes.find(
    (attr) => attr.key === 'Portion'
  )?.value

  const getFrequencyLabel = (
    sellingPlanName: string | null | undefined
  ): string => {
    if (!sellingPlanName) {
      return t('oneTimePurchase')
    }

    const nameLower = sellingPlanName.toLowerCase()
    if (
      nameLower.includes('2 week') ||
      nameLower.includes('bi-weekly') ||
      nameLower.includes('biweekly')
    ) {
      return t('frequencyBiWeekly')
    }
    if (nameLower.includes('1 week') || nameLower.includes('weekly')) {
      return t('frequencyWeekly')
    }

    return sellingPlanName
  }

  const frequencyLabel = getFrequencyLabel(
    sellingPlanAllocation?.sellingPlan?.name
  )

  const handleDecrease = useCallback(() => {
    if (!disabled) {
      onDecreaseClick()
    }
  }, [disabled, onDecreaseClick])

  const handleIncrease = useCallback(() => {
    if (!disabled) {
      onIncreaseClick()
    }
  }, [disabled, onIncreaseClick])

  const handleDelete = useCallback(() => {
    if (!disabled) {
      onDeleteClick()
    }
  }, [disabled, onDeleteClick])

  const handleFrequencyChange = useCallback(
    (value: string) => {
      if (!disabled && onFrequencyChange) {
        onFrequencyChange(value as 'weekly' | 'bi-weekly')
      }
    },
    [disabled, onFrequencyChange]
  )

  const handleRecipeChange = useCallback(
    (value: string) => {
      if (!disabled && onRecipeChange) {
        onRecipeChange(value as 'turkey' | 'lamb' | 'pancreatic')
      }
    },
    [disabled, onRecipeChange]
  )

  const productTitle = productVariant.product?.title || ''
  const variantTitle =
    productVariant.title && productVariant.title !== 'Default Title'
      ? productVariant.title
      : ''
  const imageUrl = productVariant.image?.url || ''

  const isSubscription = !!sellingPlanAllocation
  const isTopper = portionAttribute === 'TOPPER'
  const isFullMeal = portionAttribute === 'FULL_MEAL'
  const isAlaCarte = !isSubscription

  // Use cost.totalAmount when available (includes quantity for A La Carte, full membership price for subscriptions)
  // Fallback to unit price * quantity if cost is not available
  const currencyCode =
    (cost?.totalAmount?.currencyCode as CurrencyCode) ||
    (productVariant.price?.currencyCode as CurrencyCode) ||
    CurrencyCode.Usd

  const price = cost?.totalAmount
    ? formatCurrency(currencyCode, parseFloat(cost.totalAmount.amount || '0'))
    : formatCurrency(
        currencyCode,
        parseFloat(productVariant.price?.amount || '0') * quantity
      )

  // Format title for subscriptions: "{Dog Name}'s Subscription | {Portion}"
  const displayTitle =
    isSubscription && dogNameAttribute
      ? `${dogNameAttribute}'s Subscription${
          portionAttribute === 'TOPPER'
            ? t('subscriptionDisplayTopper')
            : portionAttribute === 'FULL_MEAL'
              ? t('subscriptionDisplayFullMeal')
              : ''
        }`
      : productTitle

  const recipeOptions = useMemo(() => {
    const options = [
      { label: t('recipeTurkey'), value: 'turkey' },
      { label: t('recipeLamb'), value: 'lamb' },
      { label: t('recipePancreatic'), value: 'pancreatic' },
    ]
    return options.filter(
      (opt) =>
        (opt.value !== 'lamb' || lambEnabled) &&
        (opt.value !== 'pancreatic' || pancreaticEnabled)
    )
  }, [t, lambEnabled, pancreaticEnabled])

  const frequencyOptions = [
    { label: t('frequencyWeekly'), value: 'weekly' },
    { label: t('frequencyBiWeekly'), value: 'bi-weekly' },
  ]

  // Determine current frequency from selling plan name
  const currentFrequency =
    sellingPlanAllocation?.sellingPlan?.name?.toLowerCase().includes('bi') ||
    sellingPlanAllocation?.sellingPlan?.name?.toLowerCase().includes('2')
      ? 'bi-weekly'
      : sellingPlanAllocation?.sellingPlan?.name
        ? 'weekly'
        : 'weekly'

  // Determine current recipe from product title
  const getCurrentRecipe = (): 'turkey' | 'lamb' | 'pancreatic' => {
    const productTitle = productVariant.product?.title?.toLowerCase() || ''
    if (productTitle.includes('pancreatic')) {
      return 'pancreatic'
    }
    if (productTitle.includes('lamb')) {
      return 'lamb'
    }
    // Default to turkey
    return 'turkey'
  }

  const currentRecipe = getCurrentRecipe()

  return (
    <div className="bg-neutral-50 flex flex-col gap-6 py-6 w-full">
      <div className="flex gap-3 items-start w-full">
        {isSubscription && isTopper && (
          <div className="bg-secondary-200 flex items-center justify-center px-2.5 py-2.5 shrink-0">
            <p className="font-sans font-normal leading-5 text-base text-neutral-950">
              {t('badgeTopper')}
            </p>
          </div>
        )}
        {isSubscription && isFullMeal && (
          <div className="bg-secondary-200 flex items-center justify-center px-2.5 py-2.5 shrink-0">
            <p className="font-sans font-normal leading-5 text-base text-neutral-950">
              {t('badgeFullMeal')}
            </p>
          </div>
        )}
        {isAlaCarte && (
          <div className="bg-secondary-200 flex items-center justify-center px-2.5 py-2.5 shrink-0">
            <p className="font-sans font-normal leading-5 text-base text-neutral-950">
              {t('badgeSingleMeal')}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex items-start w-full">
          <div className="flex flex-1 gap-[22px] items-start min-w-0">
            <div className="h-28 relative shrink-0 w-28">
              <Image
                src={imageUrl}
                alt={t('productImageAlt', { title: productTitle })}
                fill
                className="object-cover object-center"
                sizes="96px"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 items-start min-w-0 text-neutral-950">
              <div className="flex flex-col gap-1 items-start text-base w-full">
                <p className="font-sans font-bold w-full">
                  {displayTitle}
                  {!isSubscription && variantTitle && (
                    <span className="font-sans font-normal">
                      {' '}
                      | {variantTitle}
                    </span>
                  )}
                </p>
                <p className="font-sans font-normal w-full">
                  {t('productDescriptionPlaceholder')}
                </p>
              </div>
              <p className="font-sans font-bold text-lg w-full">{price}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start w-full">
        <div className="flex gap-3 items-center w-full">
          {isSubscription ? (
            <>
              <InputDropdownProvider>
                <InputDropdown
                  value={currentFrequency}
                  options={frequencyOptions}
                  onSelect={handleFrequencyChange}
                  className="flex-1"
                  state={InputDropdownState.Filled}
                  disabled={disabled}
                />
              </InputDropdownProvider>
              <InputDropdownProvider>
                <InputDropdown
                  value={currentRecipe}
                  options={recipeOptions}
                  onSelect={handleRecipeChange}
                  className="flex-1"
                  state={InputDropdownState.Filled}
                  disabled={disabled}
                />
              </InputDropdownProvider>
            </>
          ) : (
            <>
              <div className="bg-neutral-white border border-neutral-950 flex flex-1 items-center justify-between px-[18px] shrink-0 h-full">
                <InputNumber
                  value={quantity}
                  onDecrement={handleDecrease}
                  onIncrement={handleIncrease}
                  disabled={disabled}
                  state={disabled ? 'disabled' : 'default'}
                  className="gap-0 w-full justify-between h-full [&_button]:border-0 [&_button]:p-0 [&_button]:bg-transparent [&_button]:hover:bg-transparent [&_button]:active:bg-transparent [&_button]:h-full"
                  decrementAriaLabel={t('decreaseQuantity')}
                  incrementAriaLabel={t('increaseQuantity')}
                  decrementIcon={
                    <DecrementIcon className="size-6 text-neutral-950" />
                  }
                  incrementIcon={
                    <IncrementIcon className="size-6 text-neutral-950" />
                  }
                />
              </div>
              <InputDropdownProvider>
                <InputDropdown
                  value={currentRecipe}
                  options={recipeOptions}
                  onSelect={handleRecipeChange}
                  className="flex-1"
                  state={InputDropdownState.Filled}
                  disabled={disabled}
                />
              </InputDropdownProvider>
            </>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={disabled}
            className={cn(
              'border border-feedback-error-500 flex items-center justify-center shrink-0 w-11 h-full',
              'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-600',
              { 'opacity-50 cursor-not-allowed': disabled }
            )}
            aria-label={t('deleteButtonAriaLabel', { title: productTitle })}
          >
            <TrashIcon className="size-6 text-feedback-error-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

export { ShoppingCartItem }
export type { ShoppingCartItemProps }
