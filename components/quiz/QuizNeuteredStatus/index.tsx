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
  const selectedNeuteredStatus = useWatch({
    control,
    name: 'neuteredStatus',
  })

  const options = [
    { label: t('options.neutered'), value: 'neutered' },
    { label: t('options.intact'), value: 'intact' },
  ]

  const handleNext = () => {
    goToStep(QuizStep.BreedSelection)
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 px-0 w-full'
      )}
    >
      <div className="flex flex-col gap-6 items-center w-full pb-12">
        <div
          className={cn(
            'flex flex-col gap-4 items-center',
            'text-center w-full',
            'text-secondary-950'
          )}
        >
          <h2
            className={cn(
              'font-display font-semibold',
              'text-4xl leading-12 tracking-tight',
              'w-full'
            )}
          >
            {t('heading', { name: dogName })}
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
