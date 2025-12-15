'use client'

import { useTranslations } from 'next-intl'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { BreedDropdown } from '@/components/quiz/QuizBreedSelection/BreedDropdown'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { BREEDS } from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizBreedSelectionProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizBreedSelection = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizBreedSelectionProps) => {
  const t = useTranslations('Quiz.breedSelection')
  const tQuiz = useTranslations('Quiz')
  const { control, watch } = formMethods

  const dogName =
    useWatch({
      control,
      name: 'name',
    }) || ''

  const selectedBreed = watch('breed')

  const handleNext = () => {
    goToStep(QuizStep.Step5)
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 w-full h-full'
      )}
    >
      <div className="flex-1 flex flex-col gap-12 items-center w-full md:max-w-2xl md:mx-auto pb-16">
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
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <Controller
              name="breed"
              control={control}
              render={({ field: { value, onChange } }) => (
                <BreedDropdown
                  value={value}
                  onSelect={onChange}
                  breeds={BREEDS}
                  placeholder={t('placeholder')}
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
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleNext}
        continueButtonText={tQuiz('continueButton')}
        continueDisabled={!selectedBreed}
      />
    </div>
  )
}

export { QuizBreedSelection }
