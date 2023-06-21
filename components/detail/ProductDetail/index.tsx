'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useCallback } from 'react'

import ImageGallery from '@/components/detail/ImageGallery'
import ProductDescription, {
  VARIANT,
} from '@/components/detail/ProductDescription'
import { client } from 'shopify/client'
import {
  useGetProductDetailQuery,
  ProductVariantConnection,
  ImageConnection,
} from 'shopify/generated/graphql'

interface ProductDetailProps {
  handle: string
}

const ProductDetail = ({ handle }: ProductDetailProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data, isError } = useGetProductDetailQuery(client, {
    handle,
  })

  const handleSetVariant = useCallback(
    (variantId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(VARIANT, variantId)
      router.replace(`${pathname}?${params}`)
    },
    [searchParams, router, pathname]
  )

  if (isError || !data?.product) {
    return null // product probably not found
  }
  const { description, images, title, variants } = data?.product

  const variantId =
    searchParams.get(VARIANT) ||
    variants.edges.find(({ node }) => node.availableForSale)?.node.id ||
    variants.edges[0].node.id

  if (!variants.edges.length && !images.edges.length) {
    return null
  }

  return (
    <>
      <div className="w-full md:w-1/2">
        <ImageGallery
          title={title}
          variants={variants as ProductVariantConnection}
          images={images as ImageConnection}
        />
      </div>
      <div className="w-full md:w-1/2">
        <ProductDescription
          title={title}
          description={description}
          variants={variants as ProductVariantConnection}
          images={images as ImageConnection}
          handleSetVariant={handleSetVariant}
          variantId={variantId}
        />
      </div>
    </>
  )
}

export default ProductDetail
