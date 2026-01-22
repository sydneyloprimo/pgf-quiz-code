'use client'

import { useTranslations } from 'next-intl'
import { client } from 'shopify/client'
import { useGetCartQuery } from 'shopify/generated/graphql'

import { ShoppingCartIcon } from '@/components/common/Icon'
import useCartCookie from '@/hooks/useCartCookie'
import useShoppingCartPanel from '@/hooks/useShoppingCartPanel'
import { cn } from '@/utils/cn'

interface FloatingCartButtonProps {
  className?: string
  onOpenCart?: () => void
  isCartOpen?: boolean
}

const FloatingCartButton = ({
  className,
  onOpenCart,
  isCartOpen = false,
}: FloatingCartButtonProps) => {
  const t = useTranslations('Common.FloatingCartButton')
  const { cartId } = useCartCookie()
  const { openCart: defaultOpenCart, isOpen: defaultIsCartOpen } =
    useShoppingCartPanel()

  const handleOpenCart = onOpenCart || defaultOpenCart
  const cartIsOpen = isCartOpen || defaultIsCartOpen

  const { data } = useGetCartQuery(
    client,
    { id: cartId },
    {
      enabled: !!cartId,
      refetchOnWindowFocus: false,
    }
  )

  const totalQuantity = data?.cart?.totalQuantity ?? 0
  const hasItems = totalQuantity > 0

  if (cartIsOpen) {
    return null
  }

  return (
    <button
      type="button"
      onClick={handleOpenCart}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'bg-primary-800 border border-primary-800',
        'flex items-center justify-center',
        'p-3',
        'shadow-[0px_32px_64px_0px_rgba(79,94,113,0.07),0px_16px_32px_0px_rgba(79,94,113,0.08),0px_8px_16px_0px_rgba(79,94,113,0.09),0px_4px_8px_0px_rgba(79,94,113,0.1),0px_2px_4px_0px_rgba(79,94,113,0.11),0px_0px_2px_0px_rgba(79,94,113,0.12)]',
        'hover:bg-primary-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
        'transition-colors',
        'cursor-pointer',
        className
      )}
      aria-label={t('openCartAriaLabel')}
    >
      <div className="relative">
        <ShoppingCartIcon className="size-6 text-neutral-white" />
        {hasItems && (
          <span
            className={cn(
              'absolute -top-2 -right-2',
              'bg-feedback-error-500',
              'text-neutral-white',
              'text-xs font-bold',
              'rounded-full',
              'min-w-[20px] h-5',
              'flex items-center justify-center',
              'px-1.5'
            )}
            aria-label={t('itemCountAriaLabel', { count: totalQuantity })}
          >
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </span>
        )}
      </div>
    </button>
  )
}

export { FloatingCartButton }
export type { FloatingCartButtonProps }
