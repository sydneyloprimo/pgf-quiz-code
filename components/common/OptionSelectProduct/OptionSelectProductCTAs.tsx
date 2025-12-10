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
}

const OptionSelectProductCTAs = ({
  pricePerDay,
  onDetailsClick,
  onSubscribeClick,
  onAddToCartClick,
  isAlaCarte = false,
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
    <div className="flex flex-row gap-3 mt-2">
      <Button variant="tertiary" onClick={handleDetailsClick} className="flex">
        {t('detailsButton')}
      </Button>
      {isAlaCarte ? (
        <Button
          variant="primary"
          onClick={handleAddToCartClick}
          className="flex-1"
        >
          {t('addToCartButton')}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={handleSubscribeClick}
          className="flex-1"
        >
          {t('subscribeButton', {
            price: `$${pricePerDay?.toFixed(2) || '0.00'}`,
          })}
        </Button>
      )}
    </div>
  )
}

export { OptionSelectProductCTAs }
export type { OptionSelectProductCTAsProps }
