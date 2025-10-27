import { dehydrate } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { Metadata } from 'next'
import { client } from 'shopify/client'
import { useGetProductDetailQuery } from 'shopify/generated/graphql'
import getQueryClient from 'utils/getQueryClient'

import ProductDetail from '@/components/detail/ProductDetail'

interface ProductDetailProps {
  params: Promise<{
    handle: string
  }>
}

interface MetadataProps {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ variant?: string }>
}

export async function generateMetadata({
  params,
  searchParams,
}: MetadataProps) {
  const queryClient = getQueryClient()
  const { handle } = await params
  const searchParamsResolved = await searchParams

  const data = await queryClient.fetchQuery({
    queryKey: useGetProductDetailQuery.getKey({ handle }),
    queryFn: () => useGetProductDetailQuery.fetcher(client, { handle })(),
  })

  if (!data?.product) return null

  const { description, images, title, variants } = data.product

  const variantId =
    searchParamsResolved.variant ||
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
  const { handle } = await params

  try {
    await queryClient.prefetchQuery({
      queryKey: useGetProductDetailQuery.getKey({ handle }),
      queryFn: () => useGetProductDetailQuery.fetcher(client, { handle })(),
    })
  } catch (error) {
    console.error('Server-side fetch error:', error)
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="container flex min-h-screen flex-col md:flex-row md:mb-24 md:justify-center rounded-lg bg-white shadow-1">
        <ProductDetail handle={handle} />
      </div>
    </HydrationBoundary>
  )
}
