import { ReadonlyURLSearchParams } from 'next/navigation'

import { FilterParams, Filters } from '@/hooks/useProductSearch'
import { CartLineEdge } from '@/shopify/generated/graphql'

/* eslint-disable max-len */

export const formatCurrency = (currencyCode: string, amount: number) =>
  `${currencyCode} ${amount.toFixed(2)}`

export const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/

export const findProductLine = (edges: CartLineEdge[], productId: string) =>
  edges.find(({ node: { id } }) => id === productId)

export const buildQueryString = (params: {
  [key: string]: string | number | undefined | null | boolean | string[]
}) =>
  Object.keys(params)
    .filter((param) => params[param])
    .map(
      (param) =>
        `${encodeURIComponent(param)}=${encodeURIComponent(
          Array.isArray(params[param]) && (params[param] as string[]).length
            ? (params[param] as string[]).join(',')
            : `${params[param]}`
        )}`
    )
    .join('&')

export const buildQueryUrl = (
  path: string,
  params: {
    [key: string]: string | number | undefined | null | boolean | string[]
  }
) => `${path}?${buildQueryString(params)}`

export const buildFiltersFromQuery = (
  searchParams: ReadonlyURLSearchParams
) => {
  const entries = [...searchParams.entries()] as Array<
    [key: FilterParams | 'page', value: string]
  >
  return entries.reduce((acc, [key, value]) => {
    if (key === FilterParams.tags) acc[key] = value.split(',')
    if (key === FilterParams.available) acc[key] = value === 'true'
    if (
      key === FilterParams.condition ||
      key === FilterParams.productType ||
      key === FilterParams.vendor ||
      key === FilterParams.productTitle ||
      key === FilterParams.priceMin ||
      key === FilterParams.priceMax
    )
      acc[key] = value
    return acc
  }, {} as Filters)
}
