import { CartLineInput } from 'shopify/generated/graphql'

import {
  PACK_SIZE_GRAMS,
  PRODUCT_CONFIGS,
  type ProductConfig,
} from '@/constants'

export const calculateWeeklyPacks = (dailyFoodGrams: number): number => {
  return Math.ceil((dailyFoodGrams * 7) / PACK_SIZE_GRAMS)
}

type RecipeSlug = 'turkey' | 'lamb' | 'pancreatic'
type Frequency = 'WEEKLY' | 'BIWEEKLY' | 'ONETIME'
type Portion = 'FULL_MEAL' | 'TOPPER'

interface GenerateCartPayloadParams {
  recipeSlug: RecipeSlug
  calculatedWeeklyPacks: number
  frequency: Frequency
  portion: Portion
  dogName?: string
  productConfig?: ProductConfig | null
}

export const generateCartPayload = ({
  recipeSlug,
  calculatedWeeklyPacks,
  frequency,
  portion,
  dogName,
  productConfig,
}: GenerateCartPayloadParams): CartLineInput => {
  // Use provided config or fallback to hardcoded constant
  const config =
    productConfig || (PRODUCT_CONFIGS[recipeSlug] as unknown as ProductConfig)

  let quantity = calculatedWeeklyPacks

  if (frequency === 'WEEKLY' || frequency === 'BIWEEKLY') {
    if (portion === 'TOPPER') {
      quantity = Math.ceil(calculatedWeeklyPacks * 0.5)
    }
    if (frequency === 'BIWEEKLY') {
      quantity = quantity * 2
    }
  }

  // Ensure quantity is at least 1
  quantity = Math.max(1, quantity)

  const sellingPlanId =
    frequency === 'WEEKLY'
      ? config.sellingPlanIds.weekly || null
      : frequency === 'BIWEEKLY'
        ? config.sellingPlanIds.biweekly || null
        : null

  const attributes: Array<{ key: string; value: string }> = [
    {
      key: 'Portion',
      value: portion,
    },
  ]

  // Only include "Dog Name" attribute for subscriptions (not A La Carte)
  if (frequency !== 'ONETIME' && dogName) {
    attributes.push({
      key: 'Dog Name',
      value: dogName,
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

  return payload
}
