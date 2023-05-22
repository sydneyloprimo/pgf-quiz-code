'use client'
import cn from 'classnames'
import Image from 'next/image'
import { GetAllProductsQuery } from 'shopify/generated/graphql'

// TODO: Change the product card props
interface ProductCardProps {
  product: GetAllProductsQuery['products']['edges'][0]['node']
  className?: string
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  return (
    <button
      className={cn(
        'bg-white flex hover:opacity-80 active:opacity-80 md:h-auto',
        className
      )}
    >
      <div className="w-[79px] h-[120px] rounded-lg relative md:w-[197px] md:h-[182px]">
        <Image
          className="md:rounded-lg"
          src={product.images.edges?.[0]?.node?.url}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 120px, (min-width: 768px) 182pxw"
          alt={`${product.title} image`}
        />
      </div>
      <div className="p-[26px] flex flex-col justify-between md:p-10">
        <h3 className="text-sm text-start font-bold md:text-xl">
          {product.title}
        </h3>
        <h3 className="text-sm text-start md:text-xl">
          ${product.priceRange.minVariantPrice.amount}
        </h3>
      </div>
    </button>
  )
}

export default ProductCard
