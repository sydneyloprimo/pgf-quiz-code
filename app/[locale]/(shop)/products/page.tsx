import { dehydrate } from '@tanstack/query-core'

import ProductCatalog from '@/components/products/ProductCatalog'
import Hydrate from '@/utils/hydrate.client'
import { client } from 'shopify/client'
import { useGetAllProductsQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

export default async function ProductPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    useGetAllProductsQuery.getKey(),
    useGetAllProductsQuery.fetcher(client)
  )
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex min-h-screen bg-background flex-col px-4 py-2.5 md:flex-row md:pb-[106px] md:justify-center md:pt-[25px] md:px-0">
        <ProductCatalog />
      </div>
    </Hydrate>
  )
}
