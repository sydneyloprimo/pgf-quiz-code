'use client'

import cn from 'classnames'
import ProductCard from 'components/products/ProductCard'
import Image from 'next/image'
import ChevronIcon from 'public/icons/chevron-left.svg'
import { useState } from 'react'
import { client } from 'shopify/client'
import { useGetAllProductsQuery } from 'shopify/generated/graphql'

interface ProductListProps {
  className?: string
}

const ProductList = ({ className }: ProductListProps) => {
  const [variables, setVariables] = useState({})

  // TODO: Add pagination
  const { data } = useGetAllProductsQuery(
    client,
    {
      first: 2,
      ...variables,
    },
    { keepPreviousData: true }
  )

  const { pageInfo, edges } = data?.products || {}

  const onNextClick = () => {
    setVariables({ after: pageInfo?.endCursor })
  }

  const onPreviousClick = () => {
    // TODO: Add previous page click
  }

  return (
    <div className="flex flex-col">
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
          className="flex hover:opacity-80 disabled:opacity-80"
          onClick={onPreviousClick}
        >
          <Image src={ChevronIcon} className="m-auto mr-5" alt="" />
          <p>Previous Page</p>
        </button>
        <span>Page 1 of 7</span>
        <button
          className="flex hover:opacity-80 disabled:opacity-80"
          onClick={onNextClick}
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
