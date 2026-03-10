import { CartLineInput } from 'shopify/generated/graphql'

import {
  PACKS_CLARIFICATION_ATTRIBUTE_KEY,
  PACKS_CLARIFICATION_MESSAGE_FORMAT,
  PACK_SIZE_GRAMS,
  PRODUCT_CONFIGS,
  type ProductConfig,
} from '@/constants'

export const calculatePacksForPeriod = (
  dailyFoodGrams: number,
  days: number
): number => {
  return Math.ceil((dailyFoodGrams * days) / PACK_SIZE_GRAMS)
}

export const calculateWeeklyPacks = (dailyFoodGrams: number): number => {
  return calculatePacksForPeriod(dailyFoodGrams, 7)
}

export const calculateBiweeklyPacks = (dailyFoodGrams: number): number => {
  return calculatePacksForPeriod(dailyFoodGrams, 14)
}

type RecipeSlug = 'turkey' | 'lamb' | 'pancreatic'
type Frequency = 'WEEKLY' | 'BIWEEKLY' | 'ONETIME'
type Portion = 'FULL_MEAL' | 'TOPPER'

interface GenerateCartPayloadParams {
  recipeSlug: RecipeSlug
  packsPerDelivery: number
  frequency: Frequency
  portion: Portion
  dogName?: string
  productConfig?: ProductConfig | null
}

export const generateCartPayload = ({
  recipeSlug,
  packsPerDelivery,
  frequency,
  portion,
  dogName,
  productConfig,
}: GenerateCartPayloadParams): CartLineInput => {
  // Use provided config or fallback to PRODUCT_CONFIGS (from env vars)
  const config =
    productConfig || (PRODUCT_CONFIGS[recipeSlug] as unknown as ProductConfig)

  // Prefer selling plan IDs from productConfig (API); fallback to PRODUCT_CONFIGS (env)
  const envConfig = PRODUCT_CONFIGS[recipeSlug] as unknown as ProductConfig
  const sellingPlanWeekly =
    config.sellingPlanIds.weekly ?? envConfig.sellingPlanIds.weekly
  const sellingPlanBiweekly =
    config.sellingPlanIds.biweekly ?? envConfig.sellingPlanIds.biweekly

  const quantity = Math.max(1, packsPerDelivery)

  const sellingPlanId =
    frequency === 'WEEKLY'
      ? sellingPlanWeekly || null
      : frequency === 'BIWEEKLY'
        ? sellingPlanBiweekly || null
        : null

  const attributes: Array<{ key: string; value: string }> = [
    {
      key: 'Portion',
      value: portion,
    },
  ]

  // Only include "Dog Name" and packs clarification for subscriptions (not A La Carte)
  if (frequency !== 'ONETIME') {
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
      frequency,
      configSource: productConfig ? 'productConfig (API)' : 'PRODUCT_CONFIGS',
      envSellingPlans: {
        weekly: envConfig.sellingPlanIds.weekly,
        biweekly: envConfig.sellingPlanIds.biweekly,
      },
    })
  }

  return payload
}
