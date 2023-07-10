import { dehydrate } from '@tanstack/query-core'

import OrderList from '@/components/orders/OrderList'
import Hydrate from '@/utils/hydrate.client'
import { client } from 'shopify/client'
import { useGetAllProductsQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

export default async function OrdersPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    useGetAllProductsQuery.getKey(),
    useGetAllProductsQuery.fetcher(client)
  )
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex min-h-screen flex-col relative bg-background">
        <div className="bg-dark-violet h-[295px] hidden md:inline" />
        <div className="absolute flex flex-col justify-between md:bg-white md:shadow-3 rounded-lg md:mx-[119px] top-[32px] left-0 right-0 m-auto px-4 md:px-8 md:py-7">
          <OrderList />
        </div>
      </div>
    </Hydrate>
  )
}
