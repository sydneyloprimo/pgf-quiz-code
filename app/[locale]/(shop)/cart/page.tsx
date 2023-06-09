import { dehydrate } from '@tanstack/query-core'
import { cookies } from 'next/headers'

import { Cookies } from '@/types/enums/cookies'
import Hydrate from '@/utils/hydrate.client'
import Cart from 'components/cart/CartList'
import { client } from 'shopify/client'
import { useGetCartQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

export default async function CartPage() {
  const cookieStore = cookies()
  const cartId = cookieStore.get(Cookies.cart)?.value || ''

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    useGetCartQuery.getKey({ id: cartId }),
    useGetCartQuery.fetcher(client, { id: cartId })
  )
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex min-h-screen flex-col relative bg-background">
        <div className="bg-dark-violet h-[295px] hidden md:inline" />
        <div className="absolute flex flex-col justify-between md:bg-white md:shadow-3 rounded-lg md:mx-[119px] top-[32px] left-0 right-0 m-auto px-4 md:px-8 md:py-7">
          <Cart className="md:mt-7" />
        </div>
      </div>
    </Hydrate>
  )
}
