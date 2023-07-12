'use client'

import cn from 'classnames'
import { useRouter } from 'next/navigation'

import ListNextButton, {
  ListNextButtonTypes,
} from '@/components/common/ListNextButton'
import { Routes } from '@/types/enums/routes'
import ProductCard from 'components/products/ProductCard'
import { PageInfo, ProductEdge } from 'shopify/generated/graphql'

interface ProductListProps {
  products: ProductEdge[]
  className?: string
  onPreviousClick: () => void
  onNextClick: () => void
  pageInfo?: PageInfo
}

const ProductList = ({
  className,
  products,
  onNextClick,
  onPreviousClick,
  pageInfo,
}: ProductListProps) => {
  const router = useRouter()

  return (
    <div className="flex flex-col flex-1 justify-between md:flex-none md:justify-normal">
      <div
        className={cn(
          'flex-initial shadow-1 rounded-lg md:shadow-none md:rounded-0',
          className
        )}
      >
        {products?.map(({ node: product }, index) => (
          <ProductCard
            key={`${product.id}-${product.title}`}
            product={product}
            onClick={() => router.push(`${Routes.detail}${product.handle}`)}
            className={cn(
              'w-full overflow-hidden border-b-dark-grey border-b border-solid border-t-transparent border-x-transparent md:mb-5 md:shadow-1 md:rounded-lg md:border-none md:border-transparent',
              {
                'rounded-b-lg border-b-0': index === products.length - 1,
                'rounded-t-lg': index === 0,
              }
            )}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <ListNextButton
          type={ListNextButtonTypes.previous}
          disabled={!pageInfo?.hasPreviousPage}
          onClick={onPreviousClick}
        />
        <ListNextButton
          type={ListNextButtonTypes.next}
          disabled={!pageInfo?.hasNextPage}
          onClick={onNextClick}
        />
      </div>
    </div>
  )
}

export default ProductList
