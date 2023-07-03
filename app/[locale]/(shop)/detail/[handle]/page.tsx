import { dehydrate } from '@tanstack/query-core'
import { Hydrate } from '@tanstack/react-query'

import ProductDetail from '@/components/detail/ProductDetail'
import { client } from 'shopify/client'
import { useGetProductDetailQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

interface ProductDetailProps {
  params: {
    handle: string
  }
}

export default async function Detail({ params }: ProductDetailProps) {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    useGetProductDetailQuery.getKey({ handle: params.handle }),
    useGetProductDetailQuery.fetcher(client, { handle: params.handle })
  )
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="container flex min-h-screen flex-col md:px-4 py-2.5 md:flex-row md:px-7 md:py-14 md:mb-24 md:justify-center rounded-lg bg-white shadow-1">
        <ProductDetail handle={params.handle} />
      </div>
    </Hydrate>
  )
}
