'use client'

import { useTranslations } from 'next-intl'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { InputDropdown } from '@/components/common/InputDropdown'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { ACTIVITY_LEVEL_OPTIONS } from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizHowActiveProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizHowActive = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizHowActiveProps) => {
  const t = useTranslations('Quiz.howActive')
  const tQuiz = useTranslations('Quiz')
  const { control } = formMethods

  const dogName =
    useWatch({
      control,
      name: 'name',
    }) || ''

  const activityLevel = useWatch({
    control,
    name: 'activityLevel',
  })

  const handleNext = () => {
    goToStep(QuizStep.Step8)
  }

  const isFormValid = Boolean(activityLevel)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'pt-0 px-0 w-full'
      )}
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
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center w-full">
          <div className="w-full">
            <Controller
              name="activityLevel"
              control={control}
              render={({ field: { value, onChange } }) => (
                <InputDropdown
                  value={value}
                  onSelect={onChange}
                  options={ACTIVITY_LEVEL_OPTIONS}
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
        continueDisabled={!isFormValid}
      />
    </div>
  )
}

export { QuizHowActive }
