'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { GetCartQuery } from '@/shopify/generated/graphql'
import { formatCurrency } from '@/utils/helpers'

interface ShoppingCartFooterProps {
  cart: GetCartQuery['cart'] | null | undefined
  onCheckoutClick: () => void
  onClose: () => void
  disabled: boolean
}

const ShoppingCartFooter = ({
  cart,
  onCheckoutClick,
  onClose,
  disabled,
}: ShoppingCartFooterProps) => {
  const t = useTranslations('Common.ShoppingCartPanel')

  const handleCheckout = useCallback(() => {
    if (!disabled) {
      onCheckoutClick()
    }
  }, [disabled, onCheckoutClick])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const totalAmount = formatCurrency(
    cart?.cost?.subtotalAmount?.currencyCode,
    Number(cart?.cost?.subtotalAmount?.amount || '0')
  )

  return (
    <div className="bg-neutral-white w-full px-[22px] py-6 border-t border-neutral-300 shrink-0">
      <div className="flex flex-col gap-3 items-start w-full">
        <Button
          variant="primary"
          onClick={handleCheckout}
          disabled={disabled}
          className="w-full h-11"
        >
          {t('checkoutButton')}
        </Button>
        <Button
          variant="tertiary"
          onClick={handleClose}
          disabled={disabled}
          className="w-full h-11"
        >
          {t('closeButton')}
        </Button>
      </div>
    </div>
  )
}

export { ShoppingCartFooter }
export type { ShoppingCartFooterProps }
