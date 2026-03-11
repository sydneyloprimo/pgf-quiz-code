import { QuizFormData } from '@/components/quiz/QuizLayout'
import {
  clearFormData,
  clearPersonalData,
  QUIZ_FORM_STORAGE_KEY,
  QUIZ_PERSONAL_DATA_KEY,
} from '@/components/quiz/storage'
import {
  ACTIVITY_LEVEL_FACTORS,
  BODY_SHAPE_FACTORS,
  MAX_DOG_WEIGHT_LBS,
  MODE_MULTIPLIERS,
  NEUTERED_STATUS_FACTORS,
  PRODUCTS,
  PUPPY_MAX_AGE_YEARS,
  QUIZ_RESULTS_PARAM_KEYS,
  RER_BASE,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'

export { clearFormData, clearPersonalData }

export interface QuizPersonalData {
  firstName?: string
  lastName?: string
  email?: string
  zipCode?: string
}

export const getStoredFormData = (): Partial<QuizFormData> | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const stored = window.localStorage.getItem(QUIZ_FORM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const saveFormData = (data: Partial<QuizFormData>) => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(QUIZ_FORM_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore localStorage errors
  }
}

export const getPersonalData = (): QuizPersonalData | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const stored = window.localStorage.getItem(QUIZ_PERSONAL_DATA_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const savePersonalData = (data: QuizPersonalData) => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(
      QUIZ_PERSONAL_DATA_KEY,
      JSON.stringify({
        firstName: data.firstName?.trim() || undefined,
        lastName: data.lastName?.trim() || undefined,
        email: data.email?.trim() || undefined,
        zipCode: data.zipCode?.trim() || undefined,
      })
    )
  } catch {
    // Ignore localStorage errors
  }
}

export const formatQuizFormDataAsNote = (
  data: Partial<QuizFormData>
): string => {
  const lines: string[] = []
  if (data.name) lines.push(`Dog name: ${data.name}`)
  if (data.gender) lines.push(`Gender: ${data.gender}`)
  if (data.age) lines.push(`Age: ${data.age} years`)
  if (data.weight) lines.push(`Weight: ${data.weight} lbs`)
  if (data.zipCode) lines.push(`ZIP code: ${data.zipCode}`)
  if (data.neuteredStatus) lines.push(`Neutered status: ${data.neuteredStatus}`)
  if (data.breed) lines.push(`Breed: ${data.breed}`)
  if (data.bodyShape) lines.push(`Body condition: ${data.bodyShape}`)
  if (data.mainFood) lines.push(`Main food: ${data.mainFood}`)
  if (data.treatFrequency) lines.push(`Treat frequency: ${data.treatFrequency}`)
  if (data.mealtimeBehavior) {
    lines.push(`Mealtime behavior: ${data.mealtimeBehavior}`)
  }
  if (data.activityLevel) {
    lines.push(`Activity level: ${data.activityLevel}`)
  }
  if (data.subscriptionType) {
    lines.push(`Subscription type: ${data.subscriptionType}`)
  }
  return lines.join('\n')
}

export const formatAgeText = (age: string): string => {
  return `${age}-year-old`
}

export const getQuizBenefits = (
  shipmentFrequency: string | undefined,
  dogName: string,
  weeklyPacks: number,
  t: (key: string, values?: Record<string, string | number>) => string
): Array<{ icon: 'check' | 'shipping'; text: string }> => {
  const benefits: Array<{ icon: 'check' | 'shipping'; text: string }> = []
  if (shipmentFrequency) {
    const whatYoullGetKey =
      shipmentFrequency === 'everyWeek'
        ? 'products.whatYoullGet.everyWeek'
        : 'products.whatYoullGet.everyTwoWeeks'
    benefits.push({
      icon: 'shipping',
      text: t(whatYoullGetKey, { name: dogName }),
    })
  }
  benefits.push(
    {
      icon: 'check',
      text: t('products.benefits.packRecommendationReason', {
        name: dogName,
        packs: weeklyPacks,
      }),
    },
    {
      icon: 'check',
      text: t('products.benefits.saveOverheads', { name: dogName }),
    },
    {
      icon: 'check',
      text: t('products.benefits.freshlyPortioned', { name: dogName }),
    },
    {
      icon: 'check',
      text: t('products.benefits.flexibleSchedule', { name: dogName }),
    }
  )
  return benefits
}

export const getQuizBenefitsAlaCarte = (
  t: (key: string) => string
): Array<{ icon: 'check'; text: string }> => {
  return [
    {
      icon: 'check',
      text: t('products.benefits.noSubscriptionRequired'),
    },
    {
      icon: 'check',
      text: t('products.benefits.oneTimeDelivery'),
    },
    {
      icon: 'check',
      text: t('products.benefits.bestForFirstTimers'),
    },
  ]
}

export const isAllowedAgeInput = (val: string): boolean =>
  val === '' ||
  (!val.includes('-') && (Number.isNaN(Number(val)) || Number(val) >= 0))

export const getNextQuizStep = (age: string, weight: string): QuizStep => {
  const ageNum = parseInt(age, 10)
  const weightNum = parseInt(weight, 10)
  if (ageNum < PUPPY_MAX_AGE_YEARS) {
    return QuizStep.UnderAge
  }
  if (weightNum > MAX_DOG_WEIGHT_LBS) {
    return QuizStep.Plus25Lbs
  }
  return QuizStep.BreedSelection
}

export const calculateDailyFoodAndPrice = (
  formData: QuizFormData,
  recipe: 'turkey' | 'lamb',
  mode: 'topper' | 'full'
): { dailyFoodGrams: number } => {
  const weightLbs = Number(formData.weight) || 0
  const weightKg = weightLbs / 2.20462

  const rer = RER_BASE * Math.pow(weightKg, 0.75)

  const neuteredFactor =
    formData.neuteredStatus === 'neutered'
      ? NEUTERED_STATUS_FACTORS.neutered
      : NEUTERED_STATUS_FACTORS.intact

  const activityFactor =
    formData.activityLevel && formData.activityLevel in ACTIVITY_LEVEL_FACTORS
      ? ACTIVITY_LEVEL_FACTORS[
          formData.activityLevel as keyof typeof ACTIVITY_LEVEL_FACTORS
        ]
      : 0

  const bodyShapeFactor =
    formData.bodyShape && formData.bodyShape in BODY_SHAPE_FACTORS
      ? BODY_SHAPE_FACTORS[
          formData.bodyShape as keyof typeof BODY_SHAPE_FACTORS
        ]
      : 1.0

  const dailyCalories =
    rer * neuteredFactor * (1 + activityFactor) * bodyShapeFactor

  const product = PRODUCTS[recipe]
  const modeMultiplier = MODE_MULTIPLIERS[mode]

  const dailyFoodGrams = (dailyCalories / product.kcalPerGram) * modeMultiplier

  return { dailyFoodGrams }
}

export const buildQuizResultsUrl = (
  formData: Partial<QuizFormData>,
  packs: number
): string => {
  if (typeof window === 'undefined') {
    return ''
  }
  const params = new URLSearchParams()
  for (const key of QUIZ_RESULTS_PARAM_KEYS) {
    const value = formData[key as keyof QuizFormData]
    if (value != null && value !== '') {
      params.set(key, String(value))
    }
  }
  params.set('packs', String(packs))
  const pathname = window.location.pathname
  const resultsPath = pathname.replace(/\/results-beta$/, '/results')
  return `${window.location.origin}${resultsPath}?${params.toString()}`
}

interface SearchParamsLike {
  get: (key: string) => string | null
}

export const parseQuizParamsFromUrl = (
  searchParams: URLSearchParams | SearchParamsLike
): Partial<QuizFormData> | null => {
  const name = searchParams.get('name')
  if (!name) {
    return null
  }
  const result: Partial<QuizFormData> = { name }
  for (const key of QUIZ_RESULTS_PARAM_KEYS) {
    if (key === 'name') continue
    const value = searchParams.get(key)
    if (value != null && value !== '') {
      ;(result as Record<string, string>)[key] = value
    }
  }
  return result
}
