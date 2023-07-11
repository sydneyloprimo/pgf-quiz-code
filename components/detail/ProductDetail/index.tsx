'use client'

import { useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'

import ImageGallery from '@/components/detail/ImageGallery'
import ProductDescription, {
  VARIANT,
} from '@/components/detail/ProductDescription'
import { client } from 'shopify/client'
import {
  useGetProductDetailQuery,
  ProductVariantConnection,
  ImageConnection,
  Product,
} from 'shopify/generated/graphql'

interface ProductDetailProps {
  handle: string
}

const ProductDetail = ({ handle }: ProductDetailProps) => {
  const searchParams = useSearchParams()
  const { data, isError } = useGetProductDetailQuery(client, {
    handle,
  })

  const {
    description = '',
    images: productImages,
    title,
    variants,
  } = data?.product as Product

  const [variantId, setVariantId] = useState(
    searchParams.get(VARIANT) ||
      variants.edges.find(({ node }) => node.availableForSale)?.node.id ||
      variants.edges[0]?.node.id
  )

  const { variant, images } = useMemo(() => {
    const variant = variants.edges.find(({ node }) => node.id === variantId)
    const images = variant?.node.image
      ? { edges: [{ node: variant.node.image }] }
      : productImages

    return {
      images,
      variant,
    }
  }, [variants, variantId, productImages])

  if (isError || !data?.product || !variant || !images.edges.length) {
    return null
  }

  return (
    <>
      <div className="w-full md:w-1/2">
        <ImageGallery
          title={title}
          variant={variant?.node}
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
          handleSetVariant={setVariantId}
          variantId={variantId}
          variant={variant?.node}
        />
      </div>
    </>
  )
}

export default ProductDetail
