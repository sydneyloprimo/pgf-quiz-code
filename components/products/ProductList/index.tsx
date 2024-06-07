'use client'

import cn from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import ListNextButton, {
  ListNextButtonTypes,
} from '@/components/common/ListNextButton'
import Select from '@/components/common/Select'
import { FilterParams, Filters } from '@/hooks/useProductSearch'
import { Routes } from '@/types/enums/routes'
import ProductCard from 'components/products/ProductCard'
import {
  PageInfo,
  ProductEdge,
  ProductSortKeys,
} from 'shopify/generated/graphql'

interface ProductListProps {
  products: ProductEdge[]
  className?: string
  onPreviousClick: () => void
  onNextClick: () => void
  onSortChange: (filters: Filters) => void
  pageInfo?: PageInfo
}

const buildSortValue = (sortKey: ProductSortKeys, reverse?: boolean) =>
  JSON.stringify({ reverse, sortKey })

const options = [
  {
    label: 'Price: Low to High',
    value: buildSortValue(ProductSortKeys.Price, false),
  },
  {
    label: 'Price: High to Low',
    value: buildSortValue(ProductSortKeys.Price, true),
  },
  {
    label: 'Newest',
    value: buildSortValue(ProductSortKeys.CreatedAt, false),
  },
  {
    label: 'Oldest',
    value: buildSortValue(ProductSortKeys.CreatedAt, true),
  },
  {
    label: 'Best Selling',
    value: buildSortValue(ProductSortKeys.BestSelling, false),
  },
]

const ProductList = ({
  className,
  products,
  onNextClick,
  onPreviousClick,
  onSortChange,
  pageInfo,
}: ProductListProps) => {
  const router = useRouter()
  const t = useTranslations('Search')

  const searchParams = useSearchParams()
  const term = searchParams.get(FilterParams.productTitle)

  const URLSelectedSortOption = ((): (typeof options)[number] => {
    const sortKeyParam = searchParams.get(
      FilterParams.sortKey
    ) as ProductSortKeys

    if (!sortKeyParam) return options[2]

    const reverseParam = Boolean(searchParams.get(FilterParams.reverse))
    const foundOption =
      options.find(
        (option) => option.value === buildSortValue(sortKeyParam, reverseParam)
      ) ?? options[2]
    return foundOption
  })()

  const handleSortChange = useCallback(
    (newSortOptionSelected: (typeof options)[number]) => {
      const { sortKey: newSortKey, reverse: newReverse } = JSON.parse(
        newSortOptionSelected.value
      )

      onSortChange({ reverse: newReverse, sortKey: newSortKey })
    },
    [onSortChange]
  )

  return (
    <div className="flex flex-col flex-1 flex-start md:flex-none md:justify-normal">
      <div className="flex justify-between place-items-center mb-4">
        <p>{term ? t('searchTerms', { term }) : ''} </p>

        <div className="flex items-center">
          <span className="font-bold mr-2">Sort by</span>
          <Select
            defaultSelectedItem={URLSelectedSortOption}
            options={options}
            onSelectedItemChange={handleSortChange}
            data-qa="product-sort-select"
          />
        </div>
      </div>
      <div
        className={cn(
          'flex-initial shadow-1 rounded-lg md:shadow-none md:rounded-0',
          className
        )}
      >
        {products &&
          products?.map(({ node: product }, index) => (
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
              data-qa="product-card"
            />
          ))}
      </div>
      <div className="flex justify-between pt-2">
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
