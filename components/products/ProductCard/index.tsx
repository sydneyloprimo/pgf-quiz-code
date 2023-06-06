'use client'
import cn from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// TODO: Change the product type
interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any
  className?: string
  isVariant?: boolean
}

const ProductCard = ({
  product,
  className,
  isVariant = false,
}: ProductCardProps) => {
  const { push } = useRouter()

  return (
    <button
      onClick={() => push(`/detail/${product.handle}`)}
      className={cn(
        'bg-white flex hover:shadow-2 active:border-active-outline active:border-[3px] focus:border-dashed focus:border-2 focus:border-focus focus:outline-none md:h-auto md:focus:border-none md:focus:outline-dashed md:focus:outline-2 md:focus:outline-focus ',
        className
      )}
    >
      <div className="w-[79px] h-[120px] rounded-lg relative md:w-[197px] md:h-[182px]">
        <Image
          className="md:rounded-l-lg"
          src={
            isVariant ? product.image.url : product.images.edges?.[0]?.node?.url
          }
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
          {isVariant
            ? `${product.priceV2.currencyCode} ${product.priceV2.amount}`
            : `${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`}
        </h3>
      </div>
    </button>
  )
}

export default ProductCard
