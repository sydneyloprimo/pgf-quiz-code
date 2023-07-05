import { CartLineEdge } from '@/shopify/generated/graphql'

/* eslint-disable max-len */

export const formatCurrency = (currencyCode: string, amount: number) =>
  `${currencyCode} ${amount.toFixed(2)}`

export const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/

export const findProductLine = (edges: CartLineEdge[], productId: string) =>
  edges.find(({ node: { id } }) => id === productId)

export const buildQueryString = (params: {
  [key: string]: string | number | undefined | null | boolean
}) =>
  Object.keys(params)
    .filter((param) => params[param])
    .map(
      (param) =>
        `${encodeURIComponent(param)}=${encodeURIComponent(
          params[param] as string
        )}`
    )
    .join('&')

export const buildQueryUrl = (
  path: string,
  params: {
    [key: string]: string | number | undefined | null | boolean
  }
) => `${path}?${buildQueryString(params)}`
