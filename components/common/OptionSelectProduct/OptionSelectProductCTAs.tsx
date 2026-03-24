'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { Routes } from '@/types/enums/routes'

interface OptionSelectProductCTAsProps {
  pricePerDay?: number
  recipeValue?: string
  onSubscribeClick?: () => void
  onAddToCartClick?: () => void
  isAlaCarte?: boolean
  subscribeButtonDisabled?: boolean
  subscribeButtonText?: string
}

const OptionSelectProductCTAs = ({
  pricePerDay,
  recipeValue,
  onSubscribeClick,
  onAddToCartClick,
  isAlaCarte = false,
  subscribeButtonDisabled = false,
  subscribeButtonText,
}: OptionSelectProductCTAsProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  const handleSubscribeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSubscribeClick?.()
    },
    [onSubscribeClick]
  )

  const handleAddToCartClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onAddToCartClick?.()
    },
    [onAddToCartClick]
  )

  const recipeHash =
    recipeValue === 'pancreatic' ? 'seafood' : recipeValue || 'turkey'

  return (
    <div className="flex flex-col md:flex-row gap-3 mt-2">
      <Button
        variant="tertiary"
        href={`${Routes.recipes}#${recipeHash}`}
        className="w-full md:flex-1"
      >
        {t('detailsButton')}
      </Button>
      {isAlaCarte ? (
        <Button
          variant="primary"
          onClick={handleAddToCartClick}
          className="w-full md:flex-1"
        >
          {t('addToCartButton')}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={handleSubscribeClick}
          className="w-full md:flex-1"
          disabled={subscribeButtonDisabled}
        >
          {subscribeButtonText ||
            t('subscribeButton', {
              price: `$${pricePerDay?.toFixed(2) || '0.00'}`,
            })}
        </Button>
      )}
    </div>
  )
}

export { OptionSelectProductCTAs }
export type { OptionSelectProductCTAsProps }
