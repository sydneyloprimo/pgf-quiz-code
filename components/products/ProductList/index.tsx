'use client'

import cn from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Routes } from '@/types/enums/routes'
import ProductCard from 'components/products/ProductCard'
import ChevronIcon from 'public/icons/chevron-left.svg'
import { client } from 'shopify/client'
import {
  Product,
  useInfiniteGetAllProductsQuery,
} from 'shopify/generated/graphql'

interface ProductListProps {
  className?: string
}

const PAGE_SIZE = 4
const ProductList = ({ className }: ProductListProps) => {
  const [page, setPage] = useState(0)
  const router = useRouter()
  const t = useTranslations('Products.list')

  const { data, fetchNextPage } = useInfiniteGetAllProductsQuery(
    'first',
    client,
    {
      first: PAGE_SIZE,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage?.products?.pageInfo?.hasNextPage
          ? { after: lastPage?.products?.pageInfo?.endCursor }
          : null,
      select: ({ pageParams, pages }) => ({
        pageParams: pageParams,
        pages: pages.map(({ products: { edges, pageInfo } }) => ({
          edges,
          pageInfo,
        })),
      }),
      keepPreviousData: true,
    }
  )

  const { edges, pageInfo } = data?.pages[page] || {}

  const onNextClick = () => {
    const totalPages = data?.pages?.length
    if (!totalPages || page === totalPages - 1) {
      fetchNextPage()
    }
    setPage(page + 1)
  }

  const onPreviousClick = () => {
    setPage(page - 1)
  }

  return (
    <div className="flex flex-col flex-1 justify-between md:flex-none md:justify-normal">
      <div
        className={cn(
          'flex-initial shadow-1 rounded-lg md:shadow-none md:rounded-0',
          className
        )}
      >
        {edges?.map(({ node: product }, index) => (
          <ProductCard
            key={`${product.id}-${product.title}`}
            product={product as Product}
            onClick={() => router.push(`${Routes.detail}${product.handle}`)}
            className={cn(
              'w-full overflow-hidden border-b-dark-grey border-b border-solid border-t-transparent border-x-transparent md:mb-5 md:shadow-1 md:rounded-lg md:border-none md:border-transparent',
              {
                'rounded-t-lg': index === 0,
                'rounded-b-lg border-b-0': index === edges.length - 1,
              }
            )}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <button
          className="flex hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPreviousClick}
          disabled={page === 0}
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
