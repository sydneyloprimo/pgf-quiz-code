'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { InputDropdown } from '@/components/common/InputDropdown'
import { useQuizDropdownContext } from '@/components/quiz/QuizDropdownContext'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { ACTIVITY_LEVEL_OPTIONS } from '@/constants'
import { InputDropdownState, QuizStep } from '@/types/enums/constants'
import { getTranslatedOptions } from '@/utils/helpers'

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
  const { setDropdownOpen } = useQuizDropdownContext() ?? {}

  const dogName = useWatch({ control, name: 'name' }) || ''
  const activityLevel = useWatch({ control, name: 'activityLevel' })

  const handleNext = useCallback(() => {
    goToStep(QuizStep.Step6)
  }, [goToStep])

  const isFormValid = Boolean(activityLevel)

  const translatedActivityLevelOptions = getTranslatedOptions(
    ACTIVITY_LEVEL_OPTIONS,
    t
  )

  return (
    <div className="flex flex-col items-center justify-center pt-0 w-full">
      <div className="flex flex-col gap-12 items-center w-full md:max-w-2xl md:mx-auto pb-16">
        <div className="flex flex-col gap-6 items-center text-center w-full text-secondary-950">
          <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
            {t('heading', { name: dogName })}
          </h2>
          <p className="font-body text-xl leading-8 w-full">
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
                  options={translatedActivityLevelOptions}
                  placeholder={t('placeholder')}
                  className="w-full"
                  state={
                    value
                      ? InputDropdownState.Filled
                      : InputDropdownState.Default
                  }
                  onOpen={() => setDropdownOpen?.(true)}
                  onClose={() => setDropdownOpen?.(false)}
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
