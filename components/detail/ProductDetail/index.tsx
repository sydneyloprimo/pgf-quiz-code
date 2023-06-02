'use client'

import React from 'react'

import { client } from 'shopify/client'
import {
  useGetProductDetailQuery,
  ProductVariantConnection,
  ImageConnection,
} from 'shopify/generated/graphql'

import ImageGallery from '../ImageGallery'
import ProductDescription from '../ProductDescription'

export interface ProductDetail {
  description: string
  title: string
  variants: ProductVariantConnection
  images: ImageConnection
}

interface ProductDetailProps {
  handle: string
}

const ProductDetail = ({ handle }: ProductDetailProps) => {
  const { data, isError } = useGetProductDetailQuery(client, {
    handle,
  })

  if (isError || !data?.product) {
    return null // product probably not found
  }
  const { description, images, title, variants } = data.product

  if (!variants.edges.length || !images.edges.length) {
    return null
  }

  return (
    <>
      <div className="w-full md:w-1/2">
        <ImageGallery
          title={title}
          description={description}
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
        />
      </div>
    </>
  )
}

export default ProductDetail
