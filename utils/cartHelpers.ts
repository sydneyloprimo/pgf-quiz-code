import { CartLineInput } from 'shopify/generated/graphql'

import {
  PACKS_CLARIFICATION_ATTRIBUTE_KEY,
  PACKS_CLARIFICATION_MESSAGE_FORMAT,
  PACK_SIZE_GRAMS,
  PRODUCT_CONFIGS,
  type ProductConfig,
} from '@/constants'
import { ProductConfigsData } from '@/hooks/useProductConfigs'

export type RecipeSlug = 'turkey' | 'lamb' | 'pancreatic'
export type ProductMode = 'topper' | 'fullMeal' | 'alaCarte'

// Returns null if the title doesn't match any known recipe, instead of
// defaulting to 'turkey'. Callers decide how to handle unrecognised products.
export const getRecipeSlugFromTitle = (
  productTitle: string | null | undefined
): RecipeSlug | null => {
  const title = productTitle?.toLowerCase() ?? ''
  if (title.includes('pancreatic')) return 'pancreatic'
  if (title.includes('lamb')) return 'lamb'
  if (title.includes('turkey')) return 'turkey'
  return null
}

export const getRecipeSlugFromVariantId = (
  variantId: string,
  configs: ProductConfigsData
): RecipeSlug | null => {
  for (const [slug, config] of Object.entries(configs)) {
    if (config?.variantId === variantId) {
      return slug as RecipeSlug
    }
  }
  return null
}

export const calculatePacksForPeriod = (
  dailyFoodGrams: number,
  days: number
): number => {
  return Math.ceil((dailyFoodGrams * days) / PACK_SIZE_GRAMS)
}

export const calculateWeeklyPacks = (dailyFoodGrams: number): number => {
  return calculatePacksForPeriod(dailyFoodGrams, 7)
}

type Portion = 'FULL_MEAL' | 'TOPPER'

interface GenerateCartPayloadParams {
  recipeSlug: RecipeSlug
  packsPerDelivery: number
  portion: Portion
  dogName?: string
  productConfig?: ProductConfig | null
  sellingPlanId?: string | null
}

export const generateCartPayload = ({
  recipeSlug,
  packsPerDelivery,
  portion,
  dogName,
  productConfig,
  sellingPlanId,
}: GenerateCartPayloadParams): CartLineInput => {
  const config =
    productConfig || (PRODUCT_CONFIGS[recipeSlug] as unknown as ProductConfig)

  const quantity = Math.max(1, packsPerDelivery)
  const isSubscription = Boolean(sellingPlanId)

  const attributes: Array<{ key: string; value: string }> = [
    {
      key: 'Portion',
      value: portion,
    },
  ]

  // Only include "Dog Name" and packs clarification for subscriptions (not A La Carte)
  if (isSubscription) {
    if (dogName) {
      attributes.push({
        key: 'Dog Name',
        value: dogName,
      })
    }
    attributes.push({
      key: PACKS_CLARIFICATION_ATTRIBUTE_KEY,
      value: PACKS_CLARIFICATION_MESSAGE_FORMAT.replace(
        '{packs}',
        String(packsPerDelivery)
      ),
    })
  }

  const payload: CartLineInput = {
    merchandiseId: config.variantId,
    quantity,
    attributes,
  }

  // Only include sellingPlanId if it's not null (for subscriptions)
  if (sellingPlanId) {
    payload.sellingPlanId = sellingPlanId
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[generateCartPayload] Cart line IDs being sent:', {
      recipeSlug,
      merchandiseId: payload.merchandiseId,
      sellingPlanId: payload.sellingPlanId ?? null,
      quantity: payload.quantity,
      isSubscription,
      configSource: productConfig ? 'productConfig (API)' : 'PRODUCT_CONFIGS',
    })
  }

  return payload
}
