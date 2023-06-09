import { Product, ProductVariant } from '@/shopify/generated/graphql'

export function isProduct(
  toBeDetermined: Product | ProductVariant
): toBeDetermined is Product {
  if ((toBeDetermined as Product).__typename === 'Product') {
    return true
  }
  return false
}
