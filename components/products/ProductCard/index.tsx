'use client'
import Image from 'next/image'

import { Product, ProductVariant } from '@/shopify/generated/graphql'
import { isProduct } from '@/types/guards/products'
import { formatCurrency } from '@/utils/helpers'

interface ProductCardProps {
  product: Product | ProductVariant
  className?: string
  onClick?: () => void
}

const ProductCard = ({ product, className, onClick }: ProductCardProps) => {
  const children = (
    <div
      className={
        'bg-white flex hover:shadow-2 active:border-active-outline active:border-[3px] focus:border-dashed focus:border-2 focus:border-focus focus:outline-none md:h-auto md:focus:border-none md:focus:outline-dashed md:focus:outline-2 md:focus:outline-focus'
      }
    >
      <div className="w-[79px] h-[120px] rounded-lg relative md:w-[197px] md:h-[182px]">
        {(() => {
          const imageUrl = isProduct(product)
            ? product.images.edges?.[0]?.node?.url
            : product.image?.url

          if (!imageUrl) {
            return (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center md:rounded-l-lg">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )
          }

          return (
            <Image
              className="md:rounded-l-lg"
              src={imageUrl}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 120px, (min-width: 768px) 182pxw"
              alt={`${product.title} image`}
              priority
            />
          )
        })()}
      </div>
      <div className="p-[26px] flex flex-col justify-between md:p-10">
        <h3 className="text-sm text-start font-bold md:text-xl">
          {product.title}
        </h3>
        <h3 className="text-sm text-start md:text-xl">
          {isProduct(product)
            ? formatCurrency(
                product.priceRange.minVariantPrice.currencyCode,
                product.priceRange.minVariantPrice.amount
              )
            : formatCurrency(product.price.currencyCode, product.price.amount)}
        </h3>
      </div>
    </div>
  )

  return onClick ? (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  )
}

export default ProductCard
