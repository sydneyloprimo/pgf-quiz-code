'use client'

import cn from 'classnames'
import { useCookies } from 'react-cookie'

import { Cookies } from '@/types/enums/cookies'
import ProductCard from 'components/products/ProductCard'
import { client } from 'shopify/client'
import { useGetCartQuery } from 'shopify/generated/graphql'

interface CartProps {
  className?: string
}

const Cart = ({ className }: CartProps) => {
  const [cookies] = useCookies([Cookies.cart])

  const { data, isLoading } = useGetCartQuery(client, {
    id: cookies[Cookies.cart],
  })

  const handleCheckoutClick = () => {
    window.location.assign(cart?.checkoutUrl)
  }

  const { cart } = data || {}
  const { edges } = cart?.lines || {}

  const isEmpty = !edges?.length

  // TODO: Enhance empty state and loading state
  if (isLoading) return <h1>Loading</h1>

  if (!cart) return <div>Cart is not found</div>

  return (
    <div className="bg-white md:bg-transparent rounded-lg border-dark-grey border border-solid md:border-0">
      <div
        className={cn(
          className,
          'flex flex-col flex-1 justify-between md:flex-none md:justify-normal'
        )}
      >
        <div>
          {isEmpty && (
            <div>Your cart is empty, start adding some products!</div>
          )}
          {edges?.map(({ node: { merchandise: product } }, index) => (
            <ProductCard
              key={`${product.id}-${product.title}`}
              product={product}
              isVariant
              className={cn(
                'w-full overflow-hidden border-b-dark-grey border-b border-solid border-t-transparent md:border border-x-transparent md:mb-5 md:rounded-lg md:border-dark-grey hover:shadow-none hover:opacity-90',
                {
                  'rounded-t-lg': index === 0,
                }
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between pb-3.5 pt-4 px-3 md:p-0">
        <h3 className="text-sm uppercase m-auto md:text-xl">Total</h3>
        <div className="border-black border-b border-solid flex-1 h-[1px] my-auto mx-3.5 md:mx-[21px]" />
        <h3 className="text-sm font-bold m-auto md:text-xl">
          {`${cart?.cost?.subtotalAmount?.currencyCode}${cart?.cost?.subtotalAmount?.amount}`}
        </h3>
        <button
          className="h-7 btn-primary md:h-10 ml-5 md:ml-6"
          disabled={isEmpty}
          onClick={handleCheckoutClick}
        >
          Go to checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
