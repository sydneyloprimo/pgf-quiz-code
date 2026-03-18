export type SellingPlanType = 'weekly' | 'biweekly' | null

const BIWEEKLY_PATTERNS = [
  'bi',
  '2 week',
  '2-week',
  '2 weeks',
  'two week',
  'two weeks',
  'every 2',
] as const

const WEEKLY_PATTERNS = ['week', 'weekly'] as const

export const getSellingPlanType = (
  planName: string | null | undefined
): SellingPlanType => {
  if (!planName) {
    return null
  }

  const name = planName.toLowerCase()

  const isWeeklyPattern = WEEKLY_PATTERNS.some((pattern) =>
    name.includes(pattern)
  )

  if (!isWeeklyPattern) {
    return null
  }

  const isBiweekly = BIWEEKLY_PATTERNS.some((pattern) => name.includes(pattern))

  return isBiweekly ? 'biweekly' : 'weekly'
}

export const isBiweeklyPlan = (planName: string | null | undefined): boolean =>
  getSellingPlanType(planName) === 'biweekly'

export const isWeeklyPlan = (planName: string | null | undefined): boolean =>
  getSellingPlanType(planName) === 'weekly'
