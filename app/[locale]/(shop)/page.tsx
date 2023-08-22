import { dehydrate } from '@tanstack/query-core'

import ExploreCategories from '@/components/home/ExploreCategories'
import HeroBanner from '@/components/home/HeroBanner'
import ShopProducts from '@/components/home/ShopProducts'
import { useGetProductTypesQuery } from '@/shopify/generated/graphql'
import getQueryClient from '@/utils/getQueryClient'
import Hydrate from '@/utils/hydrate.client'
import { client } from 'shopify/client'

export default async function Home() {
  const queryClient = getQueryClient()

  const {
    productTypes: { edges },
  } = await queryClient.fetchQuery(
    useGetProductTypesQuery.getKey(),
    useGetProductTypesQuery.fetcher(client)
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <main className="flex min-h-screen flex-col items-center w-full bg-background">
        <HeroBanner />
        <ExploreCategories
          categories={edges.map(({ node }) => ({ name: node }))}
        />
        <ShopProducts />
      </main>
    </Hydrate>
  )
}
