'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  DecrementIcon,
  IncrementIcon,
  TrashIcon,
} from '@/components/common/Icon'
import { InputDropdown } from '@/components/common/InputDropdown'
import { InputDropdownProvider } from '@/components/common/InputDropdown/InputDropdownContext'
import { InputNumber } from '@/components/common/InputNumber'
import { useProductConfigs } from '@/hooks/useProductConfigs'
import {
  ProductVariant,
  Attribute,
  SellingPlanAllocation,
  CurrencyCode,
} from '@/shopify/generated/graphql'
import { InputDropdownState } from '@/types/enums/constants'
import { getRecipeSlugFromVariantId } from '@/utils/cartHelpers'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/helpers'
import { isBiweeklyPlan } from '@/utils/sellingPlanHelpers'

interface FrequencyOption {
  label: string
  value: string
}

const PENDING_FREQUENCY_TIMEOUT_MS = 15000

interface ShoppingCartItemProps {
  productVariant: ProductVariant
  quantity: number
  onDecreaseClick: () => void
  onDeleteClick: () => void
  onIncreaseClick: () => void
  onFrequencyChange?: (sellingPlanId: string) => void
  onRecipeChange?: (recipe: 'turkey' | 'lamb' | 'pancreatic') => void
  disabled: boolean
  attributes?: Attribute[]
  sellingPlanAllocation?: SellingPlanAllocation | null
  cartLineId?: string
  cost?: {
    totalAmount?: {
      amount: string
      currencyCode: string
    } | null
  } | null
  failedFrequencyLineId?: string | null
  frequencyOptions?: FrequencyOption[]
  recipeOptions?: Array<{ label: string; value: string }>
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
  failedFrequencyLineId,
  frequencyOptions: frequencyOptionsProp,
  recipeOptions: recipeOptionsProp,
}: ShoppingCartItemProps) => {
  const t = useTranslations('Common.ShoppingCartPanel')

  const { configs } = useProductConfigs()

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

    if (isBiweeklyPlan(sellingPlanName)) {
      return t('frequencyBiWeekly')
    }
    if (sellingPlanName.toLowerCase().includes('week')) {
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
        setPendingFrequency(value)
        onFrequencyChange(value)
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

  const fallbackRecipeOptions = useMemo(
    () => [
      { label: t('recipeTurkey'), value: 'turkey' },
      { label: t('recipeLamb'), value: 'lamb' },
      { label: t('recipePancreatic'), value: 'pancreatic' },
    ],
    [t]
  )

  const recipeOptions =
    recipeOptionsProp && recipeOptionsProp.length > 0
      ? recipeOptionsProp
      : fallbackRecipeOptions

  // Use only real Shopify selling plan IDs from parent. No fallback — fake
  // values like 'weekly'/'biweekly' would cause cart update API errors.
  const frequencyOptions = frequencyOptionsProp ?? []

  const currentFrequencyFromServer = useMemo(() => {
    if (frequencyOptions.length > 0) {
      return sellingPlanAllocation?.sellingPlan?.id ?? frequencyOptions[0].value
    }
    return sellingPlanAllocation?.sellingPlan?.id ?? null
  }, [frequencyOptions, sellingPlanAllocation?.sellingPlan?.id])

  const [pendingFrequency, setPendingFrequency] = useState<string | null>(null)

  useEffect(() => {
    if (pendingFrequency === null) return
    if (pendingFrequency === currentFrequencyFromServer) {
      setPendingFrequency(null)
    }
  }, [pendingFrequency, currentFrequencyFromServer])

  useEffect(() => {
    if (
      cartLineId &&
      failedFrequencyLineId &&
      cartLineId === failedFrequencyLineId
    ) {
      setPendingFrequency(null)
    }
  }, [cartLineId, failedFrequencyLineId])

  useEffect(() => {
    if (pendingFrequency === null) return
    const tId = setTimeout(() => {
      setPendingFrequency(null)
    }, PENDING_FREQUENCY_TIMEOUT_MS)
    return () => clearTimeout(tId)
  }, [pendingFrequency])

  const currentFrequency =
    pendingFrequency !== null ? pendingFrequency : currentFrequencyFromServer

  const currentRecipe =
    getRecipeSlugFromVariantId(productVariant.id, configs) ?? ''

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
                {isSubscription && (
                  <p className="font-sans font-normal text-sm w-full text-neutral-700">
                    {t('packsClarification', {
                      packs: quantity,
                    })}
                  </p>
                )}
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
              {frequencyOptions.length > 0 && (
                <InputDropdownProvider>
                  <InputDropdown
                    value={currentFrequency ?? frequencyOptions[0].value}
                    options={frequencyOptions}
                    onSelect={handleFrequencyChange}
                    className="flex-1"
                    state={InputDropdownState.Filled}
                    disabled={disabled}
                  />
                </InputDropdownProvider>
              )}
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
