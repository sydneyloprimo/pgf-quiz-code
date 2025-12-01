'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'

import Input from '@/components/common/Input'
import { InputDropdown } from '@/components/common/InputDropdown'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { MAX_DOG_WEIGHT_LBS, PUPPY_MAX_AGE_YEARS } from '@/constants'
import {
  InputDropdownState,
  InputState,
  QuizStep,
} from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizStep2Props {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizStep2 = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizStep2Props) => {
  const t = useTranslations('Quiz.step2')
  const tQuiz = useTranslations('Quiz')
  const { control, watch } = formMethods
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const name = watch('name')
  const gender = watch('gender')
  const age = watch('age')
  const weight = watch('weight')

  const genderOptions = [
    { label: t('gender.male'), value: 'male' },
    { label: t('gender.female'), value: 'female' },
  ]

  const isFormValid = Boolean(name && age && weight)

  const handleNext = () => {
    const ageNum = parseInt(age, 10)
    const weightNum = parseInt(weight, 10)
    if (ageNum <= PUPPY_MAX_AGE_YEARS) {
      goToStep(QuizStep.UnderAge)
    } else if (weightNum > MAX_DOG_WEIGHT_LBS) {
      goToStep(QuizStep.Plus25Lbs)
    } else {
      goToStep(QuizStep.Step3)
    }
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
            {t('heading')}
          </h2>
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description')}
          </p>
        </div>

        <div
          className={cn(
            'flex flex-col gap-6 items-center',
            'w-full',
            'text-secondary-950'
          )}
        >
          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-2',
              'font-display font-semibold text-2xl leading-8',
              'w-full'
            )}
          >
            <span>{t('namePrefix')}</span>
            <div className="w-32">
              <Controller
                name="name"
                control={control}
                render={({
                  field: { ref, name: fieldName, value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <Input
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    className="w-full"
                    inputClassName="font-semibold leading-8 text-secondary-950"
                    state={InputState.Filled}
                    onFocus={() => setFocusedField('name')}
                    name={fieldName}
                    error={error?.message}
                  />
                )}
              />
            </div>
            <span>{t('nameSuffix')}</span>
            <div className="w-32">
              <Controller
                name="gender"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <InputDropdown
                    value={value}
                    onSelect={(val) => {
                      onChange(val)
                      setFocusedField(null)
                    }}
                    options={genderOptions}
                    className="w-full"
                    state={InputDropdownState.Filled}
                    textClassName="font-semibold text-secondary-950"
                    onOpen={() => setFocusedField('gender')}
                    onClose={() => setFocusedField(null)}
                  />
                )}
              />
            </div>
            <span>{t('genderSuffix')}</span>
          </div>

          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-2',
              'font-display font-semibold text-2xl leading-8',
              'w-full'
            )}
          >
            <span>{t('agePrefix')}</span>
            <div className="w-24">
              <Controller
                name="age"
                control={control}
                render={({
                  field: { ref, name: fieldName, value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <Input
                    ref={ref}
                    type="number"
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    className="w-full"
                    inputClassName="text-2xl font-semibold leading-8 text-secondary-950"
                    state={InputState.Filled}
                    onFocus={() => setFocusedField('age')}
                    name={fieldName}
                    error={error?.message}
                  />
                )}
              />
            </div>
            <span>{t('ageSuffix')}</span>
            <span>{t('weightPrefix')}</span>
            <div className="w-24">
              <Controller
                name="weight"
                control={control}
                render={({
                  field: { ref, name: fieldName, value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <Input
                    ref={ref}
                    type="number"
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                      onBlur()
                      setFocusedField(null)
                    }}
                    className="w-full"
                    inputClassName="text-2xl font-semibold leading-8 text-secondary-950"
                    state={InputState.Filled}
                    onFocus={() => setFocusedField('weight')}
                    name={fieldName}
                    error={error?.message}
                  />
                )}
              />
            </div>
            <span>{t('weightSuffix')}</span>
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

export { QuizStep2 }
