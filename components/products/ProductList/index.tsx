'use client'

import cn from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Filters, useProductSearch } from '@/hooks/useProductSearch'
import { Routes } from '@/types/enums/routes'
import ProductCard from 'components/products/ProductCard'
import ChevronIcon from 'public/icons/chevron-left.svg'
import { Product } from 'shopify/generated/graphql'

interface ProductListProps {
  filters: Filters
  className?: string
}

const ProductList = ({ className, filters }: ProductListProps) => {
  const router = useRouter()
  const t = useTranslations('Products.list')

  const { onNextClick, onPreviousClick, products, pageInfo } =
    useProductSearch(filters)

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
            product={product as Product}
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
        <button
          className="flex hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPreviousClick}
          disabled={!pageInfo?.hasPreviousPage}
        >
          <Image src={ChevronIcon} className="m-auto mr-5" alt="" />
          <p>{t('previousButton')}</p>
        </button>
        <button
          className="flex hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNextClick}
          disabled={!pageInfo?.hasNextPage}
        >
          <p>{t('nextButton')}</p>
          <Image
            src={ChevronIcon}
            className="m-auto ml-5"
            style={{ transform: 'rotate(180deg)' }}
            alt=""
          />
        </button>
      </div>
    </div>
  )
}

export default ProductList
