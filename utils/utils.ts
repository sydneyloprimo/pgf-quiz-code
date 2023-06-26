import { CartLineEdge } from '@/shopify/generated/graphql'

/* eslint-disable max-len */

export const formatCurrency = (currencyCode: string, amount: number) =>
  `${currencyCode} ${amount.toFixed(2)}`

export const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/

export const findProductLine = (edges: CartLineEdge[], productId: string) =>
  edges.find(({ node: { id } }) => id === productId)
