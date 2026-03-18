import { useMemo } from 'react'
import { client } from 'shopify/client'
import { useGetVariantPricesQuery } from 'shopify/generated/graphql'

import { useProductConfigs } from './useProductConfigs'

import { PACK_SIZE_GRAMS } from '@/constants'
import { type RecipeSlug } from '@/utils/cartHelpers'

interface VariantPriceData {
  pricePerGram: number
  variantId: string
}

/**
 * Hook to fetch and calculate price per gram for product variants
 * Returns a map of recipe slug to price per gram
 */
export const useVariantPrices = () => {
  const { configs: productConfigs } = useProductConfigs()

  const variantIds = useMemo(() => {
    const ids: string[] = []
    if (productConfigs?.turkey?.variantId) {
      ids.push(productConfigs.turkey.variantId)
    }
    if (productConfigs?.lamb?.variantId) {
      ids.push(productConfigs.lamb.variantId)
    }
    if (productConfigs?.pancreatic?.variantId) {
      ids.push(productConfigs.pancreatic.variantId)
    }
    return ids
  }, [productConfigs])

  const { data, isLoading, error } = useGetVariantPricesQuery(
    client,
    { variantIds },
    {
      enabled: variantIds.length > 0,
    }
  )

  const prices = useMemo(() => {
    if (!data?.nodes) {
      return null
    }

    const priceMap: Record<'turkey' | 'lamb' | 'pancreatic', VariantPriceData> =
      {} as Record<'turkey' | 'lamb' | 'pancreatic', VariantPriceData>

    data.nodes.forEach((node) => {
      if (!node || node.__typename !== 'ProductVariant') {
        return
      }

      const variantId = node.id
      const priceAmount = parseFloat(node.price?.amount || '0')

      // Determine recipe slug from variant ID or product title
      let recipeSlug: RecipeSlug | null = null

      // Match by variant ID first (most reliable)
      if (productConfigs?.turkey?.variantId === variantId) {
        recipeSlug = 'turkey'
      } else if (productConfigs?.lamb?.variantId === variantId) {
        recipeSlug = 'lamb'
      } else if (productConfigs?.pancreatic?.variantId === variantId) {
        recipeSlug = 'pancreatic'
      } else {
        recipeSlug = null
      }

      if (recipeSlug && priceAmount > 0) {
        // Calculate price per gram: variant price is for one pack (8oz = 226.796g)
        const pricePerGram = priceAmount / PACK_SIZE_GRAMS
        priceMap[recipeSlug] = {
          pricePerGram,
          variantId,
        }
      }
    })

    return priceMap
  }, [data, productConfigs])

  return {
    prices,
    isLoading,
    error,
  }
}
