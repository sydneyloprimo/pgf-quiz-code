'use client'

import cn from 'classnames'
import ProductCard from 'components/products/ProductCard'
import Image from 'next/image'
import ChevronIcon from 'public/icons/chevron-left.svg'
import { useState } from 'react'
import { client } from 'shopify/client'
import { useInfiniteGetAllProductsQuery } from 'shopify/generated/graphql'

interface ProductListProps {
  className?: string
}

const PAGE_SIZE = 4
const ProductList = ({ className }: ProductListProps) => {
  const [page, setPage] = useState(0)

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
            product={product}
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
          <p>Previous Page</p>
        </button>
        <button
          className="flex hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNextClick}
          disabled={!pageInfo?.hasNextPage}
        >
          <p> Next Page </p>
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
