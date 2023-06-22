'use client'

import cn from 'classnames'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const cursor = searchParams.get('cursor')
  const isBefore = searchParams.get('before')

  const [page, setPage] = useState(0)
  const router = useRouter()
  const t = useTranslations('Products.list')

  const variables = !!isBefore
    ? { before: cursor, last: PAGE_SIZE }
    : {
        after: cursor,
        first: PAGE_SIZE,
      }

  const { data, fetchNextPage, fetchPreviousPage } =
    useInfiniteGetAllProductsQuery('first', client, variables, {
      select: ({ pageParams, pages }) => ({
        keepPreviousData: true,
        pageParams: pageParams,
        pages: pages.map(({ products: { edges, pageInfo } }) => ({
          edges,
          pageInfo,
        })),
      }),
    })

  const { edges, pageInfo } = data?.pages[page] || {}

  const onNextClick = () => {
    const totalPages = data?.pages?.length

    if (!totalPages || page === totalPages - 1) {
      fetchNextPage({
        pageParam: {
          after: pageInfo?.endCursor,
          before: null,
          first: PAGE_SIZE,
          last: null,
        },
      })
    }

    // Shallow redirection is not possible with next.js v13.4.5
    window.history.replaceState(
      null,
      '',
      `${Routes.products}?cursor=${pageInfo?.endCursor}`
    )
    setPage(page + 1)
  }

  const onPreviousClick = () => {
    let newCursor
    if (page == 0) {
      newCursor = data?.pages[0].pageInfo.startCursor
      fetchPreviousPage({
        pageParam: {
          after: null,
          before: newCursor,
          first: null,
          last: PAGE_SIZE,
        },
      })
    } else {
      newCursor = pageInfo?.startCursor
      setPage(page - 1)
    }

    // Shallow redirection is not possible with next.js v13.4.5
    window.history.replaceState(
      null,
      '',
      `${Routes.products}?cursor=${newCursor}&before=1`
    )
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
                'rounded-b-lg border-b-0': index === edges.length - 1,
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
