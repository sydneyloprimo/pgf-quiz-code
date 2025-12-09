'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useWatch, UseFormReturn } from 'react-hook-form'

import { QuizFormData } from '@/components/quiz/QuizLayout'
import { FoodAnimation } from '@/components/quiz/QuizLoading/FoodAnimation'
import { QuizStep } from '@/types/enums/constants'

interface QuizLoadingProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const LOADING_DURATION_MS = 5000

const QuizLoading = ({ formMethods, goToStep }: QuizLoadingProps) => {
  const t = useTranslations('Quiz.loading')
  const { control } = formMethods

  const dogName =
    useWatch({
      control,
      name: 'name',
    }) || ''

  useEffect(() => {
    const timer = window.setTimeout(() => {
      goToStep(QuizStep.Results)
    }, LOADING_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [goToStep])

  return (
    <div className="flex flex-col items-center justify-center pt-0 w-full">
      <div className="flex flex-col gap-[60px] items-center w-full py-12">
        <FoodAnimation />
        <div className="flex flex-col gap-6 items-center text-center w-full text-secondary-950">
          <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
            {t('heading', { name: dogName })}
          </h2>
          <p className="font-body text-xl leading-8 w-full">
            {t('description')}
          </p>
        </div>
      </div>
    </div>
  )
}

export { QuizLoading }
