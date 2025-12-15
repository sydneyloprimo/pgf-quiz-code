'use client'

import { useTranslations } from 'next-intl'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { BodyShapeSelector } from '@/components/quiz/QuizBodyShape/BodyShapeSelector'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizBodyShapeProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizBodyShape = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizBodyShapeProps) => {
  const t = useTranslations('Quiz.bodyShape')
  const tQuiz = useTranslations('Quiz')
  const { control } = formMethods

  const selectedBodyShape = useWatch({
    control,
    name: 'bodyShape',
  })

  const handleNext = () => {
    goToStep(QuizStep.Step6)
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center', 'pt-0 w-full')}
    >
      <div className="flex flex-col gap-12 items-center w-full pb-7">
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
            {t('heading')}
          </h2>
          <p className="font-body text-lg leading-8 w-full">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          <Controller
            name="bodyShape"
            control={control}
            render={({ field: { value, onChange } }) => (
              <BodyShapeSelector
                value={value}
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
        continueDisabled={!selectedBodyShape}
      />
    </div>
  )
}

export { QuizBodyShape }
