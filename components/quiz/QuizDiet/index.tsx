'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { InputDropdown } from '@/components/common/InputDropdown'
import { FoodAnimation } from '@/components/quiz/FoodAnimation'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import {
  FEATURE_FLAG_WAITLIST,
  MAIN_FOOD_OPTIONS,
  MEALTIME_BEHAVIOR_OPTIONS,
  QUIZ_LOADING_DURATION_MS,
  TREAT_FREQUENCY_OPTIONS,
} from '@/constants'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { InputDropdownState, QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'
import { getTranslatedOptions } from '@/utils/helpers'

interface QuizDietProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizDiet = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizDietProps) => {
  const t = useTranslations('Quiz.diet')
  const tQuiz = useTranslations('Quiz')
  const tLoading = useTranslations('Quiz.loading')
  const waitlistFlipEnabled = useFeatureFlag(FEATURE_FLAG_WAITLIST)
  const { control } = formMethods
  const [isLoading, setIsLoading] = useState(false)

  const dogName =
    useWatch({
      control,
      name: 'name',
    }) || ''

  const mainFood = useWatch({
    control,
    name: 'mainFood',
  })

  const treatFrequency = useWatch({
    control,
    name: 'treatFrequency',
  })

  const mealtimeBehavior = useWatch({
    control,
    name: 'mealtimeBehavior',
  })

  const handleNext = useCallback(() => {
    if (waitlistFlipEnabled) {
      goToStep(QuizStep.SubscriptionType)
    } else {
      setIsLoading(true)
    }
  }, [goToStep, waitlistFlipEnabled])

  useEffect(() => {
    if (!isLoading) return

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (!cancelled) {
        goToStep(QuizStep.Results)
      }
    }, QUIZ_LOADING_DURATION_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [isLoading, goToStep])

  const isFormValid = Boolean(mainFood && treatFrequency && mealtimeBehavior)

  const translatedMainFoodOptions = getTranslatedOptions(MAIN_FOOD_OPTIONS, t)
  const translatedTreatFrequencyOptions = getTranslatedOptions(
    TREAT_FREQUENCY_OPTIONS,
    t
  )
  const translatedMealtimeBehaviorOptions = getTranslatedOptions(
    MEALTIME_BEHAVIOR_OPTIONS,
    t
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-0 px-0 w-full">
        <div className="flex flex-col gap-16 items-center w-full py-12">
          <FoodAnimation />
          <div className="flex flex-col gap-6 items-center text-center w-full text-secondary-950">
            <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
              {tLoading('heading', { name: dogName })}
            </h2>
            <p className="font-body text-xl leading-8 w-full">
              {tLoading('description')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center', 'pt-0 w-full')}
    >
      <div className="flex flex-col gap-12 items-center w-full pb-16">
        <div
          className={cn(
            'flex flex-col gap-6 items-center',
            'text-center w-full',
            'text-secondary-950'
          )}
        >
          <h2
            className={cn(
              'font-display',
              'text-4xl leading-12 tracking-tight',
              'w-full'
            )}
          >
            {t('heading', { name: dogName })}
          </h2>
          <p className={cn('font-body text-xl leading-8', 'w-full')}>
            {t('description', { name: dogName })}
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center w-full">
          <div className="flex flex-wrap gap-5 items-center justify-center w-full">
            <p className="heading-h5 font-display text-secondary-950">
              {t('mainFoodLabel', { name: dogName })}
            </p>
            <div className="w-52">
              <Controller
                name="mainFood"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <InputDropdown
                    value={value}
                    onSelect={onChange}
                    options={translatedMainFoodOptions}
                    placeholder={t('mainFoodPlaceholder')}
                    className="w-full"
                    state={
                      value
                        ? InputDropdownState.Filled
                        : InputDropdownState.Default
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 items-center justify-center w-full">
            <p className="font-display heading-h5 text-secondary-950">
              {t('treatFrequencyLabel', { name: dogName })}
            </p>
            <div className="w-44">
              <Controller
                name="treatFrequency"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <InputDropdown
                    value={value}
                    onSelect={onChange}
                    options={translatedTreatFrequencyOptions}
                    placeholder={t('treatFrequencyPlaceholder')}
                    className="w-full"
                    state={
                      value
                        ? InputDropdownState.Filled
                        : InputDropdownState.Default
                    }
                  />
                )}
              />
            </div>
            <p className="heading-h5 font-display text-secondary-950">
              {t('treatFrequencySuffix')}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 items-center justify-center w-full">
            <p className="heading-h5 font-display text-secondary-950">
              {t('mealtimeBehaviorLabel', { name: dogName })}
            </p>
            <div className="w-56">
              <Controller
                name="mealtimeBehavior"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <InputDropdown
                    value={value}
                    onSelect={onChange}
                    options={translatedMealtimeBehaviorOptions}
                    placeholder={t('mealtimeBehaviorPlaceholder')}
                    className="w-full"
                    state={
                      value
                        ? InputDropdownState.Filled
                        : InputDropdownState.Default
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleNext}
        continueButtonText={tQuiz('continueButton')}
        continueDisabled={!isFormValid}
      />
    </div>
  )
}

export { QuizDiet }
