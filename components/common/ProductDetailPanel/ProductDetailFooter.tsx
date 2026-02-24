'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { InputNumber } from '@/components/common/InputNumber'

interface ProductDetailFooterProps {
  quantity: number
  onQuantityDecrement: () => void
  onQuantityIncrement: () => void
  onAddToCart: () => void
}

const ProductDetailFooter = ({
  quantity,
  onQuantityDecrement,
  onQuantityIncrement,
  onAddToCart,
}: ProductDetailFooterProps) => {
  const t = useTranslations('Common.ProductDetailPanel')

  return (
    <div className="bg-neutral-white w-full px-5 py-6 border-t border-neutral-300 shrink-0">
      <div className="flex gap-3 items-center w-full">
        <InputNumber
          value={quantity}
          onDecrement={onQuantityDecrement}
          onIncrement={onQuantityIncrement}
          min={0}
          decrementAriaLabel={t('decreaseQuantity')}
          incrementAriaLabel={t('increaseQuantity')}
        />
        <div className="flex flex-1 h-11 items-center justify-center min-w-0 relative shrink-0">
          <Button
            variant="primary"
            onClick={onAddToCart}
            className="w-full h-full"
            disabled={quantity === 0}
          >
            {t('addToCartButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProductDetailFooter }
export type { ProductDetailFooterProps }
