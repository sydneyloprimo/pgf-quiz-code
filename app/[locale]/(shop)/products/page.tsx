import { dehydrate } from '@tanstack/query-core'
import { client } from 'shopify/client'
import { useGetAllProductsQuery } from 'shopify/generated/graphql'
import { useGetProductTypesQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

import ProductCatalog from '@/components/products/ProductCatalog'
import Hydrate from '@/utils/hydrate.client'

export default async function ProductPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: useGetAllProductsQuery.getKey(),
    queryFn: () => useGetAllProductsQuery.fetcher(client, { first: 6 })(),
    initialPageParam: undefined,
  })

  const {
    productTypes: { edges },
  } = await queryClient.fetchQuery({
    queryKey: useGetProductTypesQuery.getKey(),
    queryFn: () => useGetProductTypesQuery.fetcher(client)(),
  })
  const allProductTypes = edges.map((productType) => ({
    name: productType.node,
  }))

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="flex min-h-screen bg-background flex-col px-4 py-2.5 md:flex-row md:pb-[106px] md:justify-center md:pt-[25px] md:px-0">
        <ProductCatalog productTypes={allProductTypes} />
      </div>
    </Hydrate>
  )
}
