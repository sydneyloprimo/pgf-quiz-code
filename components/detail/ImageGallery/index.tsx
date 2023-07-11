import Image from 'next/image'

import {
  ProductVariantConnection,
  ImageConnection,
  ProductVariantEdge,
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
      <p className="text-3xl font-bold mb-2 md:hidden">{`${variant?.price.currencyCode} ${variant?.price.amount}`}</p>
      <Image
        src={image.url}
        alt={image?.altText || title}
        width={Number(image.width)}
        height={Number(image.height)}
        className="w-full h-auto m-auto object-cover max-h-full max-w-[500px] rounded-2xl"
      />
    </div>
  )
}

export default ImageGallery
