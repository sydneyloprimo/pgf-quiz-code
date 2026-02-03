import { QuizFormData } from '@/components/quiz/QuizLayout'
import {
  ACTIVITY_LEVEL_FACTORS,
  BODY_SHAPE_FACTORS,
  MAX_DOG_WEIGHT_LBS,
  MODE_MULTIPLIERS,
  NEUTERED_STATUS_FACTORS,
  PRODUCTS,
  PUPPY_MAX_AGE_YEARS,
  RER_BASE,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'

const QUIZ_FORM_STORAGE_KEY = 'quiz-form-data'

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

export const clearFormData = () => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.removeItem(QUIZ_FORM_STORAGE_KEY)
  } catch {
    // Ignore localStorage errors
  }
}

export const formatAgeText = (age: string): string => {
  return `${age}-year-old`
}

export const getQuizBenefits = (
  shipmentFrequency: string | undefined,
  dogName: string,
  t: (key: string, values?: Record<string, string>) => string
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

export const getNextQuizStep = (age: string, weight: string): QuizStep => {
  const ageNum = parseInt(age, 10)
  const weightNum = parseInt(weight, 10)
  if (ageNum <= PUPPY_MAX_AGE_YEARS) {
    return QuizStep.UnderAge
  }
  if (weightNum > MAX_DOG_WEIGHT_LBS) {
    return QuizStep.Plus25Lbs
  }
  return QuizStep.NeuteredStatus
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
