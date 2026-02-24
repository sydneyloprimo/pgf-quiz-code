'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { OptionSelect } from '@/components/common/OptionSelect'
import { FoodAnimation } from '@/components/quiz/FoodAnimation'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import {
  FEATURE_FLAG_WAITLIST,
  QUIZ_LOADING_DURATION_MS,
  SUBSCRIPTION_TYPE_OPTIONS,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { getTranslatedOptions } from '@/utils/helpers'

interface QuizSubscriptionTypeProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizSubscriptionType = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizSubscriptionTypeProps) => {
  const t = useTranslations('Quiz.subscriptionType')
  const tQuiz = useTranslations('Quiz')
  const tLoading = useTranslations('Quiz.loading')
  const { control } = formMethods
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to Results when flag is OFF (subscription step only for flag ON)
  useEffect(() => {
    let cancelled = false
    fetch(`/api/feature-flags?key=${encodeURIComponent(FEATURE_FLAG_WAITLIST)}`)
      .then((res) => (res.ok ? res.json() : { enabled: false }))
      .then((json) => {
        if (!cancelled && !json.enabled) {
          goToStep(QuizStep.Results)
        }
      })
    return () => {
      cancelled = true
    }
  }, [goToStep])

  const dogName = useWatch({ control, name: 'name' }) || ''
  const subscriptionType = useWatch({ control, name: 'subscriptionType' })

  const handleNext = useCallback(() => {
    setIsLoading(true)
  }, [])

  useEffect(() => {
    if (!isLoading) return

    let cancelled = false

    const flagPromise = fetch(
      `/api/feature-flags?key=${encodeURIComponent(FEATURE_FLAG_WAITLIST)}`
    )
      .then((res) => (res.ok ? res.json() : { enabled: false }))
      .then((json) => Boolean(json.enabled))
      .catch(() => false)

    const timer = window.setTimeout(async () => {
      const waitlistFlipEnabled = await flagPromise
      if (!cancelled) {
        const nextStep = waitlistFlipEnabled
          ? QuizStep.ResultsBeta
          : QuizStep.Results
        goToStep(nextStep)
      }
    }, QUIZ_LOADING_DURATION_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [isLoading, goToStep])

  const translatedOptions = getTranslatedOptions(SUBSCRIPTION_TYPE_OPTIONS, t)

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
    <div className="flex flex-col items-center justify-center pt-0 w-full">
      <div className="flex flex-col gap-12 items-center w-full md:max-w-2xl md:mx-auto pb-16">
        <div className="flex flex-col gap-6 items-center text-center w-full text-secondary-950">
          <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
            {t('heading')}
          </h2>
          <p className="font-body text-xl leading-8 w-full">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center w-full">
          <Controller
            name="subscriptionType"
            control={control}
            render={({ field: { value, onChange } }) => (
              <OptionSelect
                options={translatedOptions}
                value={value || ''}
                onSelect={onChange}
                className="w-full"
              />
            )}
          />
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleNext}
        continueButtonText={tQuiz('continueButton')}
        continueDisabled={!subscriptionType}
      />
    </div>
  )
}

export { QuizSubscriptionType }
