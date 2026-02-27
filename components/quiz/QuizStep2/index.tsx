'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import Input from '@/components/common/Input'
import { InputDropdown } from '@/components/common/InputDropdown'
import { getNextQuizStep, isAllowedAgeInput } from '@/components/quiz/helpers'
import { useQuizDropdownContext } from '@/components/quiz/QuizDropdownContext'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
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
  const { control } = formMethods
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { setDropdownOpen } = useQuizDropdownContext() ?? {}

  const name = useWatch({ control, name: 'name' })
  const gender = useWatch({ control, name: 'gender' })
  const age = useWatch({ control, name: 'age' })
  const weight = useWatch({ control, name: 'weight' })

  const genderOptions = [
    { label: t('gender.male'), value: 'male' },
    { label: t('gender.female'), value: 'female' },
  ]

  const isFormValid = Boolean(name && age && weight)

  const handleNext = () => {
    const nextStep = getNextQuizStep(age, weight)
    goToStep(nextStep)
  }
  return (
    <div
      className={cn('flex flex-col items-center justify-center', 'pt-0 w-full')}
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
              'font-display',
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
              'flex flex-wrap items-center justify-center gap-5 md:gap-2',
              'font-display font-semibold text-xl md:text-2xl leading-8',
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
                    onOpen={() => {
                      setFocusedField('gender')
                      setDropdownOpen?.(true)
                    }}
                    onClose={() => {
                      setFocusedField(null)
                      setDropdownOpen?.(false)
                    }}
                  />
                )}
              />
            </div>
            <span>{t('genderSuffix')}</span>
          </div>

          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-5 md:gap-2',
              'font-display font-semibold text-xl md:text-2xl leading-8',
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
                    min={0}
                    value={value}
                    onChange={(e) => {
                      if (isAllowedAgeInput(e.target.value)) {
                        onChange(e)
                      }
                    }}
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
