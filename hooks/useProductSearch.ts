import { useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { formatProductsParams, buildQueryUrl } from '@/utils/utils'
import { client } from 'shopify/client'
import {
  ProductEdge,
  useInfiniteGetAllProductsQuery,
  ProductSortKeys,
} from 'shopify/generated/graphql'

export enum FilterParams {
  productTitle = 'productTitle',
  priceMin = 'priceMin',
  priceMax = 'priceMax',
  productType = 'productType',
  available = 'available',
  condition = 'condition',
  vendor = 'vendor',
  tags = 'tags',
  cursor = 'cursor',
  before = 'before',
  page = 'page',
  sortKey = 'sortKey',
  reverse = 'reverse',
}

export type Filters = {
  productTitle?: string
  priceMin?: string
  priceMax?: string
  productType?: string
  available?: boolean
  condition?: string
  vendor?: string
  cursor?: string
  before?: string
  page?: number
  tags?: string[]
  sortKey?: ProductSortKeys
  reverse?: boolean
}

export type ProductURLParameters = Record<
  string,
  string | number | undefined | null | boolean | string[]
>

const constructSearchQuery = ({
  productTitle,
  priceMax,
  priceMin,
  productType,
  condition,
  available,
  vendor,
  tags,
}: Filters): string => {
  const queryParts: string[] = []

  if (productTitle) queryParts.push(`title:${productTitle}`)
  if (priceMin) queryParts.push(`variants.price:>${priceMin}`)
  if (priceMax) queryParts.push(`variants.price:<${priceMax}`)
  if (productType) queryParts.push(`product_type:${productType}`)
  if (available) queryParts.push(`available:${available}`)
  if (vendor) queryParts.push(`vendor:${vendor}`)
  if (condition) queryParts.push(`tag:${condition}`)

  if (tags && tags.length > 0) {
    tags.forEach((tag) => queryParts.push(`tag:${tag}`))
  }

  return queryParts.join(' AND ').trim()
}

const PAGE_SIZE = 6

export const useProductSearch = () => {
  const searchParams = useSearchParams()
  const currentPath = usePathname()
  const [filters, setFilters] = useState<Filters>(
    formatProductsParams(searchParams)
  )
  const [page, setPage] = useState<number>(
    Number(searchParams.get(FilterParams.page))
  )
  const cursor = searchParams.get(FilterParams.cursor)
  const beforeParam = searchParams.get(FilterParams.before)
  const sortKeyParam = searchParams.get(FilterParams.sortKey) as ProductSortKeys
  const reverseParam = Boolean(searchParams.get(FilterParams.reverse))

  const query = useMemo(() => constructSearchQuery(filters), [filters])

  const pagingVariables = !!beforeParam
    ? { before: cursor, last: PAGE_SIZE }
    : { after: cursor, first: PAGE_SIZE }

  const variables = {
    ...pagingVariables,
    query,
    reverse: filters.reverse || reverseParam,
    sortKey: filters.sortKey || sortKeyParam || ProductSortKeys.CreatedAt,
  }

  const { data, isFetching, fetchNextPage, fetchPreviousPage } =
    useInfiniteGetAllProductsQuery('first', client, variables, {
      keepPreviousData: true,
      select: ({ pageParams, pages }) => ({
        keepPreviousData: true,
        pageParams: pageParams,
        pages: pages.map(({ products: { edges, pageInfo } }) => ({
          edges,
          pageInfo,
        })),
      }),
    })

  const products = data?.pages[page]?.edges as ProductEdge[]
  const pageInfo = data?.pages[page]?.pageInfo

  const updateURL = useCallback(
    (params: ProductURLParameters) => {
      const newURL = buildQueryUrl(currentPath, params)
      window.history.replaceState(null, '', newURL)
    },
    [currentPath]
  )

  const onNextClick = useCallback(() => {
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

    setPage((page) => page + 1)

    updateURL({
      ...filters,
      cursor: pageInfo?.endCursor,
      page,
    })
  }, [
    data?.pages?.length,
    page,
    updateURL,
    filters,
    pageInfo?.endCursor,
    fetchNextPage,
  ])

  const onPreviousClick = useCallback(() => {
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
      setPage((page) => page - 1)
    }

    updateURL({
      ...filters,
      before: 1,
      cursor: newCursor,
      page,
    })
  }, [page, updateURL, filters, data?.pages, fetchPreviousPage])

  const handleQueryChange = useCallback(
    (newFilters: Filters) => {
      setFilters((filters) => {
        setPage(0)
        updateURL({ ...filters, ...newFilters })
        return newFilters
      })
    },
    [updateURL]
  )

  useEffect(() => {
    setFilters(formatProductsParams(searchParams))
  }, [searchParams])

  return {
    handleQueryChange,
    isFetching,
    onNextClick,
    onPreviousClick,
    pageInfo,
    products,
  }
}
