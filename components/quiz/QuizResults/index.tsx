'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'

import { OptionSelectProduct } from '@/components/common/OptionSelectProduct'
import { PromiseOfCareAlert } from '@/components/common/PromiseOfCareAlert'
import {
  calculateDailyFoodAndPrice,
  getQuizBenefits,
  getQuizBenefitsAlaCarte,
} from '@/components/quiz/helpers'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizResultsFooter } from '@/components/quiz/QuizResultsFooter'
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

type ProductMode = 'topper' | 'fullMeal' | 'alaCarte'
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
    alaCarte: 'turkey',
  })
  const [shipmentFrequencies, setShipmentFrequencies] = useState<
    Record<'topper' | 'fullMeal', string>
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
    (mode: 'topper' | 'fullMeal', value: string) => {
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

  const handleAddToCartClick = useCallback(() => {
    // TODO: Handle add to cart click
  }, [])

  const dogName = formData.name || ''

  const getPricePerDay = useCallback(
    (mode: ProductMode): number => {
      if (mode === 'alaCarte') {
        return 0
      }
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
    (mode: 'topper' | 'fullMeal') => {
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

      <PromiseOfCareAlert />

      <div className="w-full flex flex-col gap-6 mx-5">
        {QUIZ_RESULT_PRODUCTS.map((product) => {
          const isSelected = selectedProductMode === product.mode
          const mode = product.mode as 'topper' | 'fullMeal'
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
              shipmentFrequencyValue={shipmentFrequencies[mode]}
              onShipmentFrequencySelect={(value) =>
                handleShipmentFrequencySelect(mode, value)
              }
              benefits={getBenefits(mode)}
              pricePerDay={getPricePerDay(mode)}
              onDetailsClick={handleDetailsClick}
              onSubscribeClick={handleSubscribeClick}
            />
          )
        })}
      </div>

      <div className="w-full flex flex-col gap-2 text-center">
        <h4 className="heading-h4 font-display font-normal text-neutral-950 tracking-tight">
          {t('tryRecipeBeforeMembership')}
        </h4>
        <h4 className="heading-h4 font-display font-normal text-neutral-950 tracking-tight">
          {t('purchaseAlaCarteHeading')}
        </h4>
      </div>

      <div className="w-full flex flex-col gap-6 mx-5">
        <OptionSelectProduct
          isSelected={selectedProductMode === 'alaCarte'}
          onSelect={() => handleProductModeSelect('alaCarte')}
          title={t('products.alaCarte.title')}
          description={t('products.alaCarte.description')}
          imageSrc="/images/product-full-meal.png"
          imageAlt={t('products.alaCarte.title')}
          isMostPopular={false}
          isAlaCarte={true}
          recipeOptions={recipeOptions}
          recipeValue={recipes.alaCarte}
          onRecipeSelect={(value) => handleRecipeSelect('alaCarte', value)}
          benefits={getQuizBenefitsAlaCarte(t)}
          onDetailsClick={handleDetailsClick}
          onAddToCartClick={handleAddToCartClick}
        />
      </div>

      <QuizResultsFooter />
    </div>
  )
}

export { QuizResults }
