import { useMemo } from 'react'
import { client } from 'shopify/client'
import {
  GetVariantSellingPlansQuery,
  useGetVariantSellingPlansQuery,
} from 'shopify/generated/graphql'

import { PRODUCT_CONFIGS } from '@/constants'

export interface ProductConfig {
  variantId: string
  sellingPlanIds: {
    weekly: string | null
    biweekly: string | null
  }
  sellingPlanPrices: {
    weekly: { perDeliveryPrice: number; currencyCode: string } | null
    biweekly: { perDeliveryPrice: number; currencyCode: string } | null
  }
  images: Array<{
    url: string
    altText: string | null
    width: number | null
    height: number | null
  }>
}

export interface ProductConfigsData {
  turkey: ProductConfig | null
  lamb: ProductConfig | null
  pancreatic: ProductConfig | null
}

/**
 * Hook to fetch product configurations (variant IDs, selling plan IDs, images)
 * dynamically. Queries variants by ID using the nodes query.
 */
export const useProductConfigs = () => {
  // Get variant IDs from hardcoded configs
  const variantIds = [
    PRODUCT_CONFIGS.turkey.variantId,
    PRODUCT_CONFIGS.lamb.variantId,
    PRODUCT_CONFIGS.pancreatic.variantId,
  ]

  // Query variants by ID using nodes query (more reliable than tag search)
  const { data: variantsData, isLoading: isLoadingVariants } =
    useGetVariantSellingPlansQuery(client, { variantIds }, { enabled: true })

  const configs = useMemo(() => {
    const result: ProductConfigsData = {
      turkey: null,
      lamb: null,
      pancreatic: null,
    }

    if (!variantsData?.nodes) {
      return result
    }

    // Extract ProductVariant type from the query result
    // The nodes query returns a union type, but we're querying by variant IDs
    // so we know these are ProductVariant nodes
    type VariantNodeType = Extract<
      GetVariantSellingPlansQuery['nodes'][number],
      { __typename?: 'ProductVariant' }
    >

    // Process each variant node
    // Since we're querying by variant IDs, we know these are ProductVariant nodes
    variantsData.nodes.forEach((node) => {
      // Check if node exists and has variant properties
      // We check for sellingPlanAllocations which is unique to ProductVariant
      if (
        !node ||
        typeof node !== 'object' ||
        !('sellingPlanAllocations' in node) ||
        !('id' in node)
      ) {
        return
      }

      // Type assertion is necessary because:
      // 1. The nodes query returns a union type
      // 2. We've verified it has sellingPlanAllocations (unique to ProductVariant)
      // 3. We're querying by known variant IDs, so we know these are variants
      // 4. __typename might be empty, so we can't rely on it for type narrowing
      const variant = node as VariantNodeType
      const variantId = variant.id

      // Determine recipe slug from variant ID
      let recipeSlug: 'turkey' | 'lamb' | 'pancreatic' | null = null

      if (variantId === PRODUCT_CONFIGS.turkey.variantId) {
        recipeSlug = 'turkey'
      } else if (variantId === PRODUCT_CONFIGS.lamb.variantId) {
        recipeSlug = 'lamb'
      } else if (variantId === PRODUCT_CONFIGS.pancreatic.variantId) {
        recipeSlug = 'pancreatic'
      }

      if (!recipeSlug) {
        return
      }

      const sellingPlans = variant.sellingPlanAllocations?.edges || []

      // Extract selling plan IDs and prices
      let weekly: string | null = null
      let biweekly: string | null = null
      let weeklyPrice: {
        perDeliveryPrice: number
        currencyCode: string
      } | null = null
      let biweeklyPrice: {
        perDeliveryPrice: number
        currencyCode: string
      } | null = null

      sellingPlans.forEach(
        (planEdge: {
          node: {
            sellingPlan: { id: string; name: string; options: Array<unknown> }
            priceAdjustments: Array<{
              perDeliveryPrice: { amount: string; currencyCode: string }
            }>
          }
        }) => {
          const plan = planEdge.node.sellingPlan
          const planName = plan.name?.toLowerCase() || ''
          const planId = plan.id
          const priceAdjustments = planEdge.node.priceAdjustments || []
          const firstPriceAdjustment = priceAdjustments?.[0]

          // Get perDeliveryPrice from price adjustments
          // priceAdjustments is an array, we need the first element's perDeliveryPrice
          const perDeliveryPrice = firstPriceAdjustment?.perDeliveryPrice
          const perDeliveryPriceAmount = perDeliveryPrice?.amount
            ? typeof perDeliveryPrice.amount === 'string'
              ? parseFloat(perDeliveryPrice.amount)
              : typeof perDeliveryPrice.amount === 'number'
                ? perDeliveryPrice.amount
                : 0
            : 0
          const currencyCode = perDeliveryPrice?.currencyCode || 'USD'

          const priceData =
            perDeliveryPriceAmount > 0
              ? {
                  perDeliveryPrice: perDeliveryPriceAmount,
                  currencyCode,
                }
              : null

          // Determine if weekly or biweekly based on name
          // Selling plan names: "1 week subscription" or "2 week subscription"
          if (planName.includes('week') || planName.includes('weekly')) {
            // Check for biweekly indicators first
            const isBiweekly =
              planName.includes('bi') ||
              planName.includes('2') ||
              planName.includes('two') ||
              planName.includes('every 2')

            if (isBiweekly) {
              biweekly = planId
              if (priceData) {
                biweeklyPrice = priceData
              }
            } else {
              weekly = planId
              if (priceData) {
                weeklyPrice = priceData
              }
            }
          }
        }
      )

      // Get images from variant or product
      const images: Array<{
        url: string
        altText: string | null
        width: number | null
        height: number | null
      }> = []

      // Add variant image if available
      if (variant.image) {
        images.push({
          url: variant.image.url || '',
          altText: variant.image.altText ?? null,
          width: variant.image.width ?? null,
          height: variant.image.height ?? null,
        })
      }

      // Add product images
      const product = variant.product
      const productImages = product?.images?.edges || []
      productImages.forEach((imgEdge) => {
        const img = imgEdge.node
        // Avoid duplicates
        if (!images.some((i) => i.url === img.url)) {
          images.push({
            url: img.url || '',
            altText: img.altText ?? null,
            width: img.width ?? null,
            height: img.height ?? null,
          })
        }
      })

      const configResult: ProductConfig = {
        variantId: variant.id,
        sellingPlanIds: {
          weekly,
          biweekly,
        },
        sellingPlanPrices: {
          weekly: weeklyPrice,
          biweekly: biweeklyPrice,
        },
        images: images.length > 0 ? images : [],
      }

      result[recipeSlug] = configResult
    })

    return result
  }, [variantsData])

  const isLoading = isLoadingVariants

  return {
    configs,
    isLoading,
  }
}
