import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Product } from '@/shopify/generated/graphql'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/helpers'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const t = useTranslations('Home.ExploreCategories')

  const {
    title,
    vendor,
    priceRange: {
      minVariantPrice: { amount, currencyCode },
    },
    images: { edges: imagesEdges },
  } = product

  const image = imagesEdges[0].node

  return (
    <div
      className={cn(
        'flex flex-col shadow-4 w-32 md:w-[211px] md:h-full rounded-lg'
      )}
    >
      <div className="w-full h-24 md:h-64 relative overflow-hidden">
        <Image
          src={image.url}
          alt={t('alt')}
          className="object-cover object-center h-full rounded-t-lg !relative"
          width={Number(image.width)}
          height={256}
        />
      </div>
      <div className="w-full flex flex-1 flex-col justify-between p-4 !h-52">
        <div>
          <h4 className="block text-sm md:text-lg font-bold md:font-regular text-dark-violet">
            {vendor}
          </h4>
          <h3 className="text-sm md:text-xl text-dark-violet font-regular">
            {title}
          </h3>
        </div>
        <span className="text-sm md:text-base">
          {formatCurrency(currencyCode, amount)}
        </span>
      </div>
    </div>
  )
}

export default ProductCard
