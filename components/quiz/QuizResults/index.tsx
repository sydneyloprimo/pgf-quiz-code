'use client'

import { useMemo } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'

import { PromiseOfCareAlert } from '@/components/common/PromiseOfCareAlert'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizResultsHeader } from '@/components/quiz/QuizResultsHeader'
import {
  ACTIVITY_LEVEL_FACTORS,
  BODY_SHAPE_FACTORS,
  MODE_MULTIPLIERS,
  NEUTERED_STATUS_FACTORS,
  PRICE_PER_GRAM,
  RER_BASE,
  RECIPE_KCAL_PER_GRAM,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizResultsProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

interface CalculationResult {
  recipe: 'turkey' | 'lamb'
  mode: 'full' | 'topper'
  rer: number
  factor: number
  mer: number
  grams: number
  gramsFinal: number
  pricePerDay: number
  pricePerMonth: number
}

const calculateResults = (formData: QuizFormData): CalculationResult[] => {
  const weightLbs = Number(formData.weight)
  if (!weightLbs || isNaN(weightLbs) || weightLbs <= 0) {
    return []
  }

  const weightKg = weightLbs * 0.453592 // Convert lbs to kg
  const rer = RER_BASE * Math.pow(weightKg, 0.75)

  const q3 =
    formData.neuteredStatus === 'neutered'
      ? NEUTERED_STATUS_FACTORS.neutered
      : NEUTERED_STATUS_FACTORS.intact

  const q10 =
    formData.activityLevel && formData.activityLevel in ACTIVITY_LEVEL_FACTORS
      ? ACTIVITY_LEVEL_FACTORS[
          formData.activityLevel as keyof typeof ACTIVITY_LEVEL_FACTORS
        ]
      : ACTIVITY_LEVEL_FACTORS['routine-walker']

  const q6 =
    formData.bodyShape && formData.bodyShape in BODY_SHAPE_FACTORS
      ? BODY_SHAPE_FACTORS[
          formData.bodyShape as keyof typeof BODY_SHAPE_FACTORS
        ]
      : BODY_SHAPE_FACTORS['ideal-balanced']

  const factor = (q3 + q10) * q6
  const mer = rer * factor

  const results: CalculationResult[] = []

  // Calculate for all 4 cases: turkey full, turkey topper, lamb full, lamb topper
  const recipes: ('turkey' | 'lamb')[] = ['turkey', 'lamb']
  const modes: ('full' | 'topper')[] = ['full', 'topper']

  for (const recipe of recipes) {
    for (const mode of modes) {
      const kcalPerGram = RECIPE_KCAL_PER_GRAM[recipe]
      const grams = Math.round(mer / kcalPerGram)
      const modeMultiplier = MODE_MULTIPLIERS[mode]
      const gramsFinal = Math.round(grams * modeMultiplier)
      const pricePerGramValue = PRICE_PER_GRAM[recipe]
      const pricePerDay = gramsFinal * pricePerGramValue
      const pricePerMonth = pricePerDay * 30

      results.push({
        recipe,
        mode,
        rer: Math.round(rer * 100) / 100,
        factor: Math.round(factor * 100) / 100,
        mer: Math.round(mer * 100) / 100,
        grams,
        gramsFinal,
        pricePerDay: Math.round(pricePerDay * 2) / 2, // Round to nearest $0.50
        pricePerMonth: Math.round(pricePerMonth * 2) / 2, // Round to nearest $0.50
      })
    }
  }

  return results
}

const QuizResults = ({ formMethods }: QuizResultsProps) => {
  const { control } = formMethods

  const formData = useWatch({ control }) as QuizFormData

  const results = useMemo(() => calculateResults(formData), [formData])

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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Input Data:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Calculations:</h2>
        {results.map((result, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-300 rounded">
            <h3 className="text-lg font-semibold mb-2">
              {result.recipe.toUpperCase()} - {result.mode.toUpperCase()}
            </h3>
            <div className="space-y-1">
              <p>RER: {result.rer} kcal</p>
              <p>Factor: {result.factor}</p>
              <p>MER: {result.mer} kcal</p>
              <p>Grams (before mode): {result.grams} g</p>
              <p>Grams Final: {result.gramsFinal} g/day</p>
              <p>Price/Day: ${result.pricePerDay.toFixed(2)}</p>
              <p>Price/Month: ${result.pricePerMonth.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Message:</h2>
        <p className="text-base">
          Because {formData.name} is a {formData.age}-year-old{' '}
          {formData.neuteredStatus === 'neutered' ? 'spayed' : 'intact'}{' '}
          {formData.breed || 'dog'} who's a{' '}
          {formData.mealtimeBehavior || 'good eater'} and gets{' '}
          {formData.treatFrequency || 'lots'} treats, we recommend{' '}
          {results[0]?.gramsFinal || 'N/A'}g of {results[0]?.recipe || 'turkey'}{' '}
          per day.
        </p>
      </div>
    </div>
  )
}

export { QuizResults }
