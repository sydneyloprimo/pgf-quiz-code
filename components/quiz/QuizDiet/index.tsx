'use client'

import { useTranslations } from 'next-intl'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { InputDropdown } from '@/components/common/InputDropdown'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import {
  MAIN_FOOD_OPTIONS,
  MEALTIME_BEHAVIOR_OPTIONS,
  TREAT_FREQUENCY_OPTIONS,
} from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

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
  const { control } = formMethods

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

  const handleNext = () => {
    goToStep(QuizStep.Step7)
  }

  const isFormValid = Boolean(mainFood && treatFrequency && mealtimeBehavior)

  const translatedMainFoodOptions = MAIN_FOOD_OPTIONS.map((option) => ({
    label: t(option.labelKey),
    value: option.value,
  }))

  const translatedTreatFrequencyOptions = TREAT_FREQUENCY_OPTIONS.map(
    (option) => ({
      label: t(option.labelKey),
      value: option.value,
    })
  )

  const translatedMealtimeBehaviorOptions = MEALTIME_BEHAVIOR_OPTIONS.map(
    (option) => ({
      label: t(option.labelKey),
      value: option.value,
    })
  )

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
            {t('description', { name: dogName })}
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center w-full">
          <div className="flex flex-wrap gap-5 items-center justify-center w-full">
            <p
              className={cn(
                'font-display',
                'text-3xl leading-10 tracking-tight',
                'text-secondary-950'
              )}
            >
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
            <p
              className={cn(
                'font-display',
                'text-3xl leading-10 tracking-tight',
                'text-secondary-950'
              )}
            >
              {t('treatFrequencyLabel')}
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
            <p
              className={cn(
                'font-display',
                'text-3xl leading-10 tracking-tight',
                'text-secondary-950'
              )}
            >
              {t('treatFrequencySuffix')}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 items-center justify-center w-full">
            <p
              className={cn(
                'font-display',
                'text-3xl leading-10 tracking-tight',
                'text-secondary-950'
              )}
            >
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
