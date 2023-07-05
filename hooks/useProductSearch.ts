import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { Routes } from '@/types/enums/routes'
import { buildQueryUrl } from '@/utils/utils'
import { client } from 'shopify/client'
import { useInfiniteGetAllProductsQuery } from 'shopify/generated/graphql'

export type Filters = {
  productTitle?: string
  priceMin?: string
  priceMax?: string
  productType?: string
  available?: boolean
  condition?: string
  vendor?: string
  tags?: string[]
}

const constructSearchQuery = ({
  productTitle,
  priceMax,
  priceMin,
  productType,
  condition,
  available,
  vendor,
  tags = [],
}: Filters): string => {
  const queryParts: string[] = []

  if (productTitle) queryParts.push(`product_title:${productTitle}`)
  if (priceMin) queryParts.push(`variants.price:>${priceMin}`)
  if (priceMax) queryParts.push(`variants.price:<${priceMax}`)
  if (productType) queryParts.push(`product_type:${productType}`)
  if (available) queryParts.push(`available:${available}`)
  if (vendor) queryParts.push(`vendor:${vendor}`)
  if (condition) queryParts.push(`tag:${condition}`)

  if (tags.length) {
    tags.forEach((tag) => queryParts.push(`tag:${tag}`))
  }

  return queryParts.join(' AND ').trim()
}

const PAGE_SIZE = 6

export const useProductSearch = (filters: Filters) => {
  const searchParams = useSearchParams()
  const cursor = searchParams.get('cursor')
  const isBefore = searchParams.get('before')

  const [page, setPage] = useState(0)

  const query = useMemo(() => constructSearchQuery(filters), [filters])

  const variables = !!isBefore
    ? { before: cursor, last: PAGE_SIZE, query }
    : { after: cursor, first: PAGE_SIZE, query }

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

  const products = data?.pages[page]?.edges || []
  const pageInfo = data?.pages[page]?.pageInfo

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

    setPage(page + 1)

    // Shallow redirection is not possible with next.js v13.4.5
    window.history.replaceState(
      null,
      '',
      buildQueryUrl(Routes.products, {
        ...filters,
        cursor: pageInfo?.endCursor,
        tags: filters.tags?.join(','),
      })
    )
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
      newCursor = data?.pages[page]?.pageInfo?.startCursor
      setPage(page - 1)
    }

    // Shallow redirection is not possible with next.js v13.4.5
    window.history.replaceState(
      null,
      '',
      buildQueryUrl(Routes.products, {
        ...filters,
        before: 1,
        cursor: newCursor,
        tags: filters.tags?.join(','),
      })
    )
  }

  useEffect(() => {
    setPage(0)
    if (!query) window.history.replaceState(null, '', Routes.products)
  }, [query])

  useEffect(() => {
    window.history.replaceState(
      null,
      '',
      buildQueryUrl(Routes.products, {
        ...filters,
        tags: filters.tags?.join(','),
      })
    )
  }, [filters])

  return { onNextClick, onPreviousClick, pageInfo, products }
}
