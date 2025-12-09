'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'

import { OptionSelectProduct } from '@/components/common/OptionSelectProduct'
import { PromiseOfCareAlert } from '@/components/common/PromiseOfCareAlert'
import {
  calculateDailyFoodAndPrice,
  getQuizBenefits,
} from '@/components/quiz/helpers'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizResultsHeader } from '@/components/quiz/QuizResultsHeader'
import { QUIZ_RESULT_PRODUCTS } from '@/constants'
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
        formData,
        recipe,
        calculationMode
      )
      return pricePerDay
    },
    [recipes, formData]
  )

  const getBenefits = useCallback(
    (mode: ProductMode) => {
      const shipmentFrequency = shipmentFrequencies[mode]
      return getQuizBenefits(shipmentFrequency, dogName, t)
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
