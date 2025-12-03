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

const QuizResults = ({ formMethods }: QuizResultsProps) => {
  const { control } = formMethods
  const t = useTranslations('Quiz.results')
  const tCommon = useTranslations('Common.OptionSelectProduct')

  const formData = useWatch({ control }) as QuizFormData

  const [selectedProductMode, setSelectedProductMode] = useState<
    'topper' | 'fullMeal' | null
  >('fullMeal')
  const [topperRecipe, setTopperRecipe] = useState<'turkey' | 'lamb'>('turkey')
  const [fullMealRecipe, setFullMealRecipe] = useState<'turkey' | 'lamb'>(
    'turkey'
  )
  const [topperShipmentFrequency, setTopperShipmentFrequency] =
    useState<string>('everyWeek')
  const [fullMealShipmentFrequency, setFullMealShipmentFrequency] =
    useState<string>('everyWeek')

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

  const handleTopperSelect = useCallback(() => {
    setSelectedProductMode('topper')
  }, [])

  const handleFullMealSelect = useCallback(() => {
    setSelectedProductMode('fullMeal')
  }, [])

  const handleTopperRecipeSelect = useCallback((value: string) => {
    setTopperRecipe(value as 'turkey' | 'lamb')
  }, [])

  const handleFullMealRecipeSelect = useCallback((value: string) => {
    setFullMealRecipe(value as 'turkey' | 'lamb')
  }, [])

  const handleTopperShipmentFrequencySelect = useCallback((value: string) => {
    setTopperShipmentFrequency(value)
  }, [])

  const handleFullMealShipmentFrequencySelect = useCallback((value: string) => {
    setFullMealShipmentFrequency(value)
  }, [])

  const handleDetailsClick = useCallback(() => {
    // TODO: Handle details click
  }, [])

  const handleSubscribeClick = useCallback(() => {
    // TODO: Handle subscribe click
  }, [])

  const topperPrice = useMemo(() => {
    const { pricePerDay } = calculateDailyFoodAndPrice(topperRecipe, 'topper')
    return pricePerDay
  }, [topperRecipe, calculateDailyFoodAndPrice])

  const fullMealPrice = useMemo(() => {
    const { pricePerDay } = calculateDailyFoodAndPrice(fullMealRecipe, 'full')
    return pricePerDay
  }, [fullMealRecipe, calculateDailyFoodAndPrice])

  const dogName = formData.name || ''

  const topperBenefits = useMemo(() => {
    const benefits = []
    if (topperShipmentFrequency) {
      const whatYoullGetKey =
        topperShipmentFrequency === 'everyWeek'
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
  }, [topperShipmentFrequency, dogName, t])

  const fullMealBenefits = useMemo(() => {
    const benefits = []
    if (fullMealShipmentFrequency) {
      const whatYoullGetKey =
        fullMealShipmentFrequency === 'everyWeek'
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
  }, [fullMealShipmentFrequency, dogName, t])

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
        <OptionSelectProduct
          isSelected={selectedProductMode === 'fullMeal'}
          onSelect={handleFullMealSelect}
          title={t('products.fullMeal.title', { name: dogName })}
          description={t('products.fullMeal.description', { name: dogName })}
          imageSrc="/images/product-full-meal.png"
          imageAlt={t('products.fullMeal.title', { name: dogName })}
          isMostPopular={true}
          recipeOptions={recipeOptions}
          recipeValue={fullMealRecipe}
          onRecipeSelect={handleFullMealRecipeSelect}
          shipmentFrequencyOptions={shipmentFrequencyOptions}
          shipmentFrequencyValue={fullMealShipmentFrequency}
          onShipmentFrequencySelect={handleFullMealShipmentFrequencySelect}
          benefits={fullMealBenefits}
          pricePerDay={fullMealPrice}
          onDetailsClick={handleDetailsClick}
          onSubscribeClick={handleSubscribeClick}
        />

        <OptionSelectProduct
          isSelected={selectedProductMode === 'topper'}
          onSelect={handleTopperSelect}
          title={t('products.topper.title')}
          description={t('products.topper.description', { name: dogName })}
          imageSrc="/images/product-topper.png"
          imageAlt={t('products.topper.title')}
          isMostPopular={false}
          recipeOptions={recipeOptions}
          recipeValue={topperRecipe}
          onRecipeSelect={handleTopperRecipeSelect}
          shipmentFrequencyOptions={shipmentFrequencyOptions}
          shipmentFrequencyValue={topperShipmentFrequency}
          onShipmentFrequencySelect={handleTopperShipmentFrequencySelect}
          benefits={topperBenefits}
          pricePerDay={topperPrice}
          onDetailsClick={handleDetailsClick}
          onSubscribeClick={handleSubscribeClick}
        />
      </div>
    </div>
  )
}

export { QuizResults }
