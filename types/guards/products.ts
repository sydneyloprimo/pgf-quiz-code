import {
  Product,
  ProductVariant,
  SellingPlanAllocation,
} from '@/shopify/generated/graphql'

export function isProduct(
  toBeDetermined: Product | ProductVariant
): toBeDetermined is Product {
  if ((toBeDetermined as Product).__typename === 'Product') {
    return true
  }
  return false
}

export function isProductVariant(
  merchandise: unknown
): merchandise is ProductVariant {
  return (
    typeof merchandise === 'object' &&
    merchandise !== null &&
    '__typename' in merchandise &&
    (merchandise as { __typename?: string }).__typename === 'ProductVariant'
  )
}

export function isSellingPlanAllocation(
  allocation: unknown
): allocation is SellingPlanAllocation {
  return (
    typeof allocation === 'object' &&
    allocation !== null &&
    'sellingPlan' in allocation
  )
}
