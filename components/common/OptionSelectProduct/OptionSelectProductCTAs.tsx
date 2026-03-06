'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'

interface OptionSelectProductCTAsProps {
  pricePerDay?: number
  onDetailsClick?: () => void
  onSubscribeClick?: () => void
  onAddToCartClick?: () => void
  isAlaCarte?: boolean
  subscribeButtonDisabled?: boolean
  subscribeButtonText?: string
}

const OptionSelectProductCTAs = ({
  pricePerDay,
  onDetailsClick,
  onSubscribeClick,
  onAddToCartClick,
  isAlaCarte = false,
  subscribeButtonDisabled = false,
  subscribeButtonText,
}: OptionSelectProductCTAsProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

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

  const handleAddToCartClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onAddToCartClick?.()
    },
    [onAddToCartClick]
  )

  return (
    <div className="flex flex-col md:flex-row gap-3 mt-2">
      <Button
        variant="tertiary"
        onClick={handleDetailsClick}
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
