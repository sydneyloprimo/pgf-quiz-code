'use client'
import cn from 'classnames'
import CartProductCard from 'components/cart/CartProductCard'
import EmptyState from 'components/cart/EmptyState'
import useCartCookie from 'hooks/useCartCookie'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { client } from 'shopify/client'
import {
  ProductVariant,
  useGetCartQuery,
  useCartLinesUpdateMutation,
  useCartLinesRemoveMutation,
  CartLineEdge,
} from 'shopify/generated/graphql'

import { ButtonPrimary } from '@/components/common/Button'
import event from '@/scripts/GoogleTagManager/event'
import { Events } from '@/types/enums/events'
import { formatCurrency } from '@/utils/helpers'
import { findProductLine } from '@/utils/utils'

interface CartProps {
  className?: string
}

const Cart = ({ className }: CartProps) => {
  const t = useTranslations('Cart')
  const { cartId } = useCartCookie()

  const {
    data,
    refetch: getCartRefetch,
    isLoading: isGetCartLoading,
  } = useGetCartQuery(client, { id: cartId })

  const [hasMounted, setHasMounted] = useState(false)

  const { mutate: updateLine, isPending: isUpdateLoading } =
    useCartLinesUpdateMutation(client, {
      onSuccess: () => {
        getCartRefetch()
      },
    })

  const { mutate: removeLine, isPending: isRemoveLoading } =
    useCartLinesRemoveMutation(client, {
      onSuccess: () => {
        getCartRefetch()
      },
    })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  const { cart } = data || {}
  const { edges } = cart?.lines || {}

  const isEmpty = !edges?.length
  const isDisabled = isGetCartLoading || isRemoveLoading || isUpdateLoading

  const handleCheckoutClick = () => {
    event(Events.goCheckout)
    window.location.assign(cart?.checkoutUrl)
  }

  const onDeleteClick = (productId: string) => {
    const productFound = edges?.find(({ node }) => node.id === productId)?.node

    event(Events.removeFromCart, {
      id: productFound?.merchandise?.id,
      price: { ...productFound?.merchandise?.price },
      title: productFound?.merchandise?.title,
    })

    removeLine({
      cartId,
      lineIds: [productId],
    })
  }

  const onDecreaseClick = (productId: string) => {
    const line = edges && findProductLine(edges as CartLineEdge[], productId)

    if (line) {
      updateLine({
        cartId,
        lines: [
          {
            id: line.node.id,
            quantity: line.node.quantity - 1,
          },
        ],
      })
    }
  }

  const onIncreaseClick = (productId: string) => {
    const line = edges?.find(({ node: { id } }) => id === productId)

    if (line) {
      updateLine({
        cartId,
        lines: [
          {
            id: line.node.id,
            quantity: line.node.quantity + 1,
          },
        ],
      })
    }
  }

  return (
    <>
      <h1 className="text-black text-base mb-4 md:mb-0 md:text-xl">
        {t('title')}
      </h1>
      <div className="bg-white md:bg-transparent rounded-lg border-dark-grey border border-solid md:border-0">
        {isEmpty ? (
          <EmptyState className="mb-[70px] md:my-40" />
        ) : (
          <>
            <div
              className={cn(
                className,
                'flex flex-col flex-1 justify-between md:flex-none md:justify-normal'
              )}
            >
              <ul>
                {edges?.map(
                  (
                    { node: { id, merchandise: productVariant, quantity } },
                    index
                  ) => (
                    <CartProductCard
                      key={`${productVariant.id}-${productVariant.title}`}
                      productVariant={productVariant as ProductVariant}
                      quantity={quantity}
                      onDeleteClick={() => onDeleteClick(id)}
                      onDecreaseClick={() => onDecreaseClick(id)}
                      onIncreaseClick={() => onIncreaseClick(id)}
                      disabled={isDisabled}
                      className={cn(
                        'w-full overflow-hidden border-b-dark-grey border-b border-solid border-t-transparent md:border border-x-transparent md:mb-5 md:rounded-lg md:border-dark-grey',
                        {
                          'rounded-t-lg': index === 0,
                        }
                      )}
                    />
                  )
                )}
              </ul>
            </div>
            <div className="flex justify-between pb-3.5 pt-4 px-3 md:p-0">
              <h3 className="text-sm uppercase m-auto md:text-xl">
                {t('total')}
              </h3>
              <div className="border-black border-b border-solid flex-1 h-px my-auto mx-3.5 md:mx-[21px]" />
              <h3 className="text-black text-sm font-bold m-auto md:text-xl">
                {formatCurrency(
                  cart?.cost?.subtotalAmount?.currencyCode,
                  cart?.cost?.subtotalAmount?.amount
                )}
              </h3>
              <ButtonPrimary
                className="h-7 md:h-10 ml-5 md:ml-6"
                disabled={isEmpty || isDisabled}
                onClick={handleCheckoutClick}
                data-qa="checkout-button"
              >
                {t('checkoutButton')}
              </ButtonPrimary>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Cart
