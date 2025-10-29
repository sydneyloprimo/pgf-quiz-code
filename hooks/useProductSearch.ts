import { useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { client } from 'shopify/client'
import {
  ProductEdge,
  useGetAllProductsQuery,
  ProductSortKeys,
} from 'shopify/generated/graphql'

import { formatProductsParams, buildQueryUrl } from '@/utils/utils'

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
  if (priceMin) queryParts.push(`variants.price:>=${priceMin}`)
  if (priceMax) queryParts.push(`variants.price:<=${priceMax}`)
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
  const cursor = searchParams.get(FilterParams.cursor)
  const beforeParam = searchParams.get(FilterParams.before)
  const sortKeyParam = searchParams.get(FilterParams.sortKey) as ProductSortKeys
  const reverseParam = Boolean(searchParams.get(FilterParams.reverse))

  const query = useMemo(() => constructSearchQuery(filters), [filters])

  const pagingVariables = beforeParam
    ? { before: cursor, last: PAGE_SIZE }
    : { after: cursor, first: PAGE_SIZE }

  const variables = {
    ...pagingVariables,
    query,
    reverse: filters.reverse || reverseParam,
    sortKey: filters.sortKey || sortKeyParam || ProductSortKeys.CreatedAt,
  }

  const { data, isFetching } = useGetAllProductsQuery(client, variables)

  const products = data?.products?.edges as ProductEdge[]
  const pageInfo = data?.products?.pageInfo

  const updateURL = useCallback(
    (params: ProductURLParameters) => {
      const newURL = buildQueryUrl(currentPath, params)
      window.history.replaceState(null, '', newURL)
    },
    [currentPath]
  )

  const onNextClick = useCallback(async () => {
    updateURL({
      ...filters,
      before: null,
      cursor: pageInfo?.endCursor,
    })
  }, [updateURL, filters, pageInfo?.endCursor])

  const onPreviousClick = useCallback(() => {
    updateURL({
      ...filters,
      before: 1,
      cursor: data?.products?.pageInfo?.startCursor,
    })
  }, [updateURL, filters, data?.products?.pageInfo?.startCursor])

  const handleQueryChange = useCallback(
    (newFilters: Filters) => {
      setFilters((filters) => {
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
