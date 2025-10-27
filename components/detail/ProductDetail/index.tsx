'use client'

import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import CrossIcon from 'public/icons/cross.svg'
import React, { useMemo, useState, useEffect } from 'react'
import { client } from 'shopify/client'
import {
  useGetProductDetailQuery,
  ProductVariantConnection,
  ImageConnection,
  Product,
} from 'shopify/generated/graphql'

import ImageGallery from '@/components/detail/ImageGallery'
import ProductDescription, {
  VARIANT,
} from '@/components/detail/ProductDescription'
import event from '@/scripts/GoogleTagManager/event'
import { Events } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'

interface ProductDetailProps {
  handle: string
}

const ProductDetail = ({ handle }: ProductDetailProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, isError, isLoading, error } = useGetProductDetailQuery(client, {
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

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(Routes.products)
    }
  }

  useEffect(() => {
    event(Events.viewVariant, {
      variant_id: variantId,
      variant_name: variant?.node.title || '',
    })
  }, [variant?.node.title, variantId])

  if (isError) {
    console.error('ProductDetail Error:', error)
    return <div>Error loading product: {String(error)}</div>
  }

  if (isLoading) {
    return <div>Loading product...</div>
  }

  if (!data?.product) {
    console.error('No product data found for handle:', handle)
    return <div>Product not found</div>
  }

  if (!variant || !images.edges.length) {
    console.error('Missing variant or images:', { variant, images })
    return <div>Product data incomplete</div>
  }

  return (
    <div className="flex flex-col w-full relative md:flex-row py-2.5 px-7 md:py-14">
      <button className="absolute top-5 right-5" onClick={goBack}>
        <Image src={CrossIcon} className="" alt="" />
      </button>
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
    </div>
  )
}

export default ProductDetail
