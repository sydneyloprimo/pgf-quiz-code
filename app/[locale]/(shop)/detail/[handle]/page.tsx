import { dehydrate } from '@tanstack/query-core'
import { Hydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import ProductDetail from '@/components/detail/ProductDetail'
import { client } from 'shopify/client'
import { useGetProductDetailQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

interface ProductDetailProps {
  params: {
    handle: string
  }
}

interface MetadataProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
  searchParams,
}: MetadataProps) {
  const queryClient = getQueryClient()

  const data = await queryClient.fetchQuery(
    useGetProductDetailQuery.getKey({ handle: params.handle }),
    useGetProductDetailQuery.fetcher(client, { handle: params.handle })
  )

  if (!data?.product) return null

  const { description, images, title, variants } = data.product

  const variantId =
    searchParams.variant ||
    variants.edges.find(({ node }) => node.availableForSale)?.node.id ||
    variants.edges[0].node.id

  const variant = variants.edges.find(
    ({ node: { id } }) => id === variantId
  )?.node

  if (variant) {
    return {
      description,
      openGraph: {
        description,
        images: variant.image?.url,
        title: `${variant.title} ${title}`,
      },
      title: `${variant.title} ${title} `,
    } as Metadata
  }

  return {
    description,
    openGraph: {
      description,
      images: images.edges[0]?.node.url,
      title,
    },
    title,
  } as Metadata
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
      <div className="container flex min-h-screen flex-col py-2.5 md:flex-row md:px-7 md:py-14 md:mb-24 md:justify-center rounded-lg bg-white shadow-1">
        <ProductDetail handle={params.handle} />
      </div>
    </Hydrate>
  )
}
