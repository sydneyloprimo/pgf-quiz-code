import Image from 'next/image'

import { formatCurrency } from '@/utils/helpers'
import {
  ProductVariantConnection,
  ImageConnection,
  ProductVariantEdge,
  CurrencyCode,
} from 'shopify/generated/graphql'

interface ImageGalleryProps {
  title: string
  variants: ProductVariantConnection
  images: ImageConnection
  variant?: ProductVariantEdge['node']
}

const ImageGallery = ({ images, title, variant }: ImageGalleryProps) => {
  const image = images.edges[0]?.node

  if (!image) {
    return null
  }

  return (
    <div className="px-4 md:px-7">
      <h2 className="text-3xl font-bold mb-2 md:hidden">{title}</h2>
      <p className="text-3xl font-bold mb-2 md:hidden">
        {formatCurrency(
          variant?.price.currencyCode || CurrencyCode.Usd,
          variant?.price.amount
        )}
      </p>
      <Image
        src={image.url}
        alt={image?.altText || title}
        width={Number(image.width)}
        height={Number(image.height)}
        className="w-full h-auto m-auto object-cover max-h-full max-w-[500px] rounded-2xl"
        data-qa="product-image"
      />
    </div>
  )
}

export default ImageGallery
