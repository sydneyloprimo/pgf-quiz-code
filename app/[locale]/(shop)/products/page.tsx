import { dehydrate } from '@tanstack/query-core'
import Image from 'next/image'

import Hydrate from '@/utils/hydrate.client'
import ProductList from 'components/products/ProductList'
import FilterIcon from 'public/icons/filter.svg'
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
        <div className="flex-initial hidden mr-6 md:inline md:w-[262px]" />
        <div className="flex-initial mb-4 flex justify-between md:hidden">
          <p className="text-sm">Your filters will appear here.</p>
          <button className="active:opacity-80">
            <Image src={FilterIcon} alt="Select filter" />
          </button>
        </div>
        <ProductList className="min-h-full md:w-[840px]" />
      </div>
    </Hydrate>
  )
}
