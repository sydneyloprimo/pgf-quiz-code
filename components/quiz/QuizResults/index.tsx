'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'

import { OptionSelectProduct } from '@/components/common/OptionSelectProduct'
import { PromiseOfCareAlert } from '@/components/common/PromiseOfCareAlert'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizResultsHeader } from '@/components/quiz/QuizResultsHeader'
import {
  ACTIVITY_LEVEL_FACTORS,
  BODY_SHAPE_FACTORS,
  MODE_MULTIPLIERS,
  NEUTERED_STATUS_FACTORS,
  PRODUCTS,
  QUIZ_RESULT_PRODUCTS,
  RER_BASE,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizResultsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

type ProductMode = 'topper' | 'fullMeal'
type Recipe = 'turkey' | 'lamb'

const QuizResults = ({ formMethods }: QuizResultsProps) => {
  const { control } = formMethods
  const t = useTranslations('Quiz.results')

  const formData = useWatch({ control }) as QuizFormData

  const [selectedProductMode, setSelectedProductMode] =
    useState<ProductMode>('fullMeal')
  const [recipes, setRecipes] = useState<Record<ProductMode, Recipe>>({
    topper: 'turkey',
    fullMeal: 'turkey',
  })
  const [shipmentFrequencies, setShipmentFrequencies] = useState<
    Record<ProductMode, string>
  >({
    topper: 'everyWeek',
    fullMeal: 'everyWeek',
  })

  const calculateDailyFoodAndPrice = useCallback(
    (
      recipe: 'turkey' | 'lamb',
      mode: 'topper' | 'full'
    ): { dailyFoodGrams: number; pricePerDay: number } => {
      const weightLbs = Number(formData.weight) || 0
      const weightKg = weightLbs / 2.20462

      const rer = RER_BASE * Math.pow(weightKg, 0.75)

      const neuteredFactor =
        formData.neuteredStatus === 'neutered'
          ? NEUTERED_STATUS_FACTORS.neutered
          : NEUTERED_STATUS_FACTORS.intact

      const activityFactor =
        formData.activityLevel &&
        formData.activityLevel in ACTIVITY_LEVEL_FACTORS
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

      const dailyFoodGrams =
        dailyCalories / (product.kcalPerGram * modeMultiplier)
      const pricePerDay = dailyFoodGrams * product.pricePerGram

      return { dailyFoodGrams, pricePerDay }
    },
    [formData]
  )

  const recipeOptions = useMemo(
    () => [
      {
        label: t('recipes.turkey'),
        value: 'turkey',
      },
      {
        label: t('recipes.lamb'),
        value: 'lamb',
      },
    ],
    [t]
  )

  const shipmentFrequencyOptions = useMemo(
    () => [
      {
        label: t('shipmentFrequencies.everyWeek'),
        value: 'everyWeek',
      },
      {
        label: t('shipmentFrequencies.everyTwoWeeks'),
        value: 'everyTwoWeeks',
      },
    ],
    [t]
  )

  const handleProductModeSelect = useCallback((mode: ProductMode) => {
    setSelectedProductMode(mode)
  }, [])

  const handleRecipeSelect = useCallback((mode: ProductMode, value: string) => {
    setRecipes((prev) => ({ ...prev, [mode]: value as Recipe }))
  }, [])

  const handleShipmentFrequencySelect = useCallback(
    (mode: ProductMode, value: string) => {
      setShipmentFrequencies((prev) => ({ ...prev, [mode]: value }))
    },
    []
  )

  const handleDetailsClick = useCallback(() => {
    // TODO: Handle details click
  }, [])

  const handleSubscribeClick = useCallback(() => {
    // TODO: Handle subscribe click
  }, [])

  const dogName = formData.name || ''

  const getPricePerDay = useCallback(
    (mode: ProductMode): number => {
      const recipe = recipes[mode]
      const calculationMode = mode === 'topper' ? 'topper' : 'full'
      const { pricePerDay } = calculateDailyFoodAndPrice(
        recipe,
        calculationMode
      )
      return pricePerDay
    },
    [recipes, calculateDailyFoodAndPrice]
  )

  const getBenefits = useCallback(
    (mode: ProductMode) => {
      const shipmentFrequency = shipmentFrequencies[mode]
      const benefits = []
      if (shipmentFrequency) {
        const whatYoullGetKey =
          shipmentFrequency === 'everyWeek'
            ? 'products.whatYoullGet.everyWeek'
            : 'products.whatYoullGet.everyTwoWeeks'
        benefits.push({
          icon: 'shipping' as const,
          text: t(whatYoullGetKey, { name: dogName }),
        })
      }
      benefits.push(
        {
          icon: 'check' as const,
          text: t('products.benefits.saveOverheads', { name: dogName }),
        },
        {
          icon: 'check' as const,
          text: t('products.benefits.freshlyPortioned', { name: dogName }),
        },
        {
          icon: 'check' as const,
          text: t('products.benefits.flexibleSchedule', { name: dogName }),
        }
      )
      return benefits
    },
    [shipmentFrequencies, dogName, t]
  )

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'px-0 pb-12 w-full',
        'gap-16'
      )}
    >
      <QuizResultsHeader formData={formData} />

      <div className="w-full">
        <PromiseOfCareAlert />
      </div>

      <div className="w-full flex flex-col gap-6 mx-5">
        {QUIZ_RESULT_PRODUCTS.map((product) => {
          const isSelected = selectedProductMode === product.mode
          const title =
            product.mode === 'fullMeal'
              ? t(product.titleKey, { name: dogName })
              : t(product.titleKey)
          const description = t(product.descriptionKey, { name: dogName })
          const imageAlt =
            product.mode === 'fullMeal'
              ? t(product.titleKey, { name: dogName })
              : t(product.titleKey)

          return (
            <OptionSelectProduct
              key={product.mode}
              isSelected={isSelected}
              onSelect={() => handleProductModeSelect(product.mode)}
              title={title}
              description={description}
              imageSrc={product.imageSrc}
              imageAlt={imageAlt}
              isMostPopular={product.isMostPopular}
              recipeOptions={recipeOptions}
              recipeValue={recipes[product.mode]}
              onRecipeSelect={(value) =>
                handleRecipeSelect(product.mode, value)
              }
              shipmentFrequencyOptions={shipmentFrequencyOptions}
              shipmentFrequencyValue={shipmentFrequencies[product.mode]}
              onShipmentFrequencySelect={(value) =>
                handleShipmentFrequencySelect(product.mode, value)
              }
              benefits={getBenefits(product.mode)}
              pricePerDay={getPricePerDay(product.mode)}
              onDetailsClick={handleDetailsClick}
              onSubscribeClick={handleSubscribeClick}
            />
          )
        })}
      </div>
    </div>
  )
}

export { QuizResults }
