import { ReadonlyURLSearchParams } from 'next/navigation'

import {
  FilterParams,
  Filters,
  ProductURLParameters,
} from '@/hooks/useProductSearch'
import { GetCartQuery } from '@/shopify/generated/graphql'

export const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/

type CartLineEdgeFromQuery = NonNullable<
  NonNullable<GetCartQuery['cart']>['lines']
>['edges'][number]

export const findProductLine = <T extends { node: { id: string } }>(
  edges: T[] | undefined,
  productId: string
): T | undefined => edges?.find(({ node: { id } }) => id === productId)

export const buildQueryString = (params: ProductURLParameters) =>
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

export const buildQueryUrl = (path: string, params: ProductURLParameters) => {
  const URLParams = buildQueryString(params)
  if (URLParams === '') return path
  else return `${path}?${URLParams}`
}

export const formatProductsParams = (
  searchParams: ReadonlyURLSearchParams
): Filters => {
  const entries = [...searchParams.entries()] as Array<
    [key: FilterParams, value: string]
  >

  const { available, tags, condition, reverse, page } = FilterParams
  return entries.reduce((acc: Filters, [key, value]) => {
    switch (key) {
      case tags:
      case condition:
        acc[tags] = value.split(',')
        break
      case available:
      case reverse:
        acc[key] = Boolean(value)
        break
      case page:
        acc[key] = Number(value)
        break
      default:
        ;(acc[key] as string) = value || ''
        break
    }

    return acc
  }, {})
}
