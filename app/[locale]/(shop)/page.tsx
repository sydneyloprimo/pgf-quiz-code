import { dehydrate } from '@tanstack/react-query'
import { client } from 'shopify/client'

import { AnnouncementToast } from '@/components/common/AnnouncementToast'
import { MainNav } from '@/components/common/MainNav'
import ExploreCategories from '@/components/home/ExploreCategories'
import HeroBanner from '@/components/home/HeroBanner'
import LatestProducts from '@/components/home/LatestProducts'
import ShopProducts from '@/components/home/ShopProducts'
import {
  useGetProductTypesQuery,
  useGetLatestProductsQuery,
  ProductEdge,
} from '@/shopify/generated/graphql'
import getQueryClient from '@/utils/getQueryClient'
import Hydrate from '@/utils/hydrate.client'

export default async function Home() {
  const queryClient = getQueryClient()

  const {
    productTypes: { edges },
  } = await queryClient.fetchQuery({
    queryKey: useGetProductTypesQuery.getKey(),
    queryFn: () => useGetProductTypesQuery.fetcher(client)(),
  })

  const { collection } = await queryClient.fetchQuery({
    queryKey: useGetLatestProductsQuery.getKey(),
    queryFn: () =>
      useGetLatestProductsQuery.fetcher(client, {
        first: 4,
        handle: process.env.NEXT_PUBLIC_LATEST_PRODUCTS_HANDLE,
      })(),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <main className="flex min-h-screen flex-col items-center w-full bg-background">
        <AnnouncementToast />
        <MainNav />
        <HeroBanner />
        <ExploreCategories
          categories={edges.map(({ node }) => ({ name: node }))}
        />
        <ShopProducts />
        <LatestProducts
          products={collection?.products.edges as ProductEdge[]}
        />
      </main>
    </Hydrate>
  )
}
