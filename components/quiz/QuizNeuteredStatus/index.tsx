'use client'

import { useTranslations } from 'next-intl'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { OptionSelect } from '@/components/common/OptionSelect'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizNeuteredStatusProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizNeuteredStatus = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizNeuteredStatusProps) => {
  const t = useTranslations('Quiz.neuteredStatus')
  const tQuiz = useTranslations('Quiz')
  const { control, watch } = formMethods

  const dogName = watch('name') || ''
  const gender = watch('gender') as 'male' | 'female' | undefined
  const selectedNeuteredStatus = useWatch({
    control,
    name: 'neuteredStatus',
  })

  const neuteredLabel =
    gender === 'female' ? t('options.spayed') : t('options.neutered')
  const heading =
    gender === 'female'
      ? t('headingFemale', { name: dogName })
      : t('headingMale', { name: dogName })

  const options = [
    { label: neuteredLabel, value: 'neutered' },
    { label: t('options.intact'), value: 'intact' },
  ]

  const handleNext = () => {
    goToStep(QuizStep.BreedSelection)
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center', 'pt-0 w-full')}
    >
      <div className="flex flex-col gap-6 items-center w-full md:max-w-2xl md:mx-auto pb-12">
        <div
          className={cn(
            'flex flex-col gap-4 items-center',
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
            {heading}
          </h2>
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description', { name: dogName })}
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center w-full">
          <Controller
            name="neuteredStatus"
            control={control}
            render={({ field: { value, onChange } }) => (
              <OptionSelect
                options={options}
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
        continueDisabled={!selectedNeuteredStatus}
      />
    </div>
  )
}

export { QuizNeuteredStatus }
