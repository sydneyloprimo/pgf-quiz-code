'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { Controller, useWatch, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon } from '@/components/common/Icon'
import Input from '@/components/common/Input'
import {
  calculateDailyFoodAndPrice,
  clearFormData,
  savePersonalData,
} from '@/components/quiz/helpers'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { useProductConfigs } from '@/hooks/useProductConfigs'
import { useQuizEnrollment } from '@/hooks/useQuizEnrollment'
import { QuizStep } from '@/types/enums/constants'
import { calculateWeeklyPacks } from '@/utils/cartHelpers'

interface QuizResultsBetaProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizResultsBeta = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizResultsBetaProps) => {
  const t = useTranslations('Quiz.resultsBeta')
  const tQuiz = useTranslations('Quiz')
  const tErrors = useTranslations('Common.EmailCustomer.errors')
  const { control, handleSubmit: rhfHandleSubmit, getValues } = formMethods

  const handleSuccess = useCallback(() => {
    const values = getValues()
    clearFormData()
    savePersonalData({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      zipCode: values.zipCode,
    })
    goToStep(QuizStep.ConfirmationBeta)
  }, [getValues, goToStep])

  const { submitQuizEnrollment, isLoading, error } =
    useQuizEnrollment(handleSuccess)

  const dogName = useWatch({ control, name: 'name' }) || ''
  const formData = useWatch({ control }) as QuizFormData
  const subscriptionType = formData.subscriptionType
  const { configs: productConfigs, isLoading: isLoadingConfigs } =
    useProductConfigs()

  const pricePerDay = useMemo(() => {
    if (
      subscriptionType !== 'complete-protocol' &&
      subscriptionType !== 'topper-protocol'
    ) {
      return 0
    }
    if (isLoadingConfigs || !productConfigs?.turkey) {
      return 0
    }
    const mode = subscriptionType === 'topper-protocol' ? 'topper' : 'full'
    const { dailyFoodGrams } = calculateDailyFoodAndPrice(
      formData,
      'turkey',
      mode
    )
    const weeklyPacks = calculateWeeklyPacks(dailyFoodGrams)
    const sellingPlanPrice = productConfigs.turkey.sellingPlanPrices.weekly
    if (!sellingPlanPrice) {
      return 0
    }
    const weeklyTotal = sellingPlanPrice.perDeliveryPrice * weeklyPacks
    return weeklyTotal / 7
  }, [subscriptionType, formData, productConfigs, isLoadingConfigs])

  const pricePerDayFormatted =
    pricePerDay > 0 ? `$${pricePerDay.toFixed(2)}` : null

  const onSubmit = useCallback(() => {
    const values = getValues()
    submitQuizEnrollment(values)
  }, [getValues, submitQuizEnrollment])

  const translatedError = error ? tErrors(error) : undefined

  return (
    <div className="flex flex-col items-center justify-center pt-0 w-full">
      <form
        onSubmit={rhfHandleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center w-full max-w-md pb-16"
      >
        <div className="flex flex-col gap-4 items-center text-center w-full text-secondary-950">
          <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
            {t('heading', { name: dogName })}
          </h2>
          <p className="font-body text-base leading-6 md:text-xl md:leading-8 w-full">
            {t('description', { name: dogName })}
            {pricePerDayFormatted && (
              <> {t('pricePerDay', { price: pricePerDayFormatted })}</>
            )}{' '}
            {t('descriptionSuffix')}
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <Controller
            name="firstName"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error: fieldError },
            }) => (
              <Input
                ref={ref}
                name={name}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                label={t('firstNameLabel')}
                labelClassName="text-secondary-950"
                error={fieldError?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error: fieldError },
            }) => (
              <Input
                ref={ref}
                name={name}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                label={t('lastNameLabel')}
                labelClassName="text-secondary-950"
                error={fieldError?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error: fieldError },
            }) => (
              <Input
                ref={ref}
                name={name}
                type="email"
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                label={t('emailLabel')}
                labelClassName="text-secondary-950"
                error={fieldError?.message}
              />
            )}
          />
        </div>

        {translatedError && (
          <p className="font-body text-sm text-feedback-error-500">
            {translatedError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full"
        >
          {t('submitButton')}
        </Button>
        <Button
          type="button"
          variant="tertiary"
          onClick={goBack}
          leftIcon={<ArrowLeftIcon className="size-3" />}
          className="w-full md:hidden"
        >
          {tQuiz('backButton')}
        </Button>
      </form>
    </div>
  )
}

export { QuizResultsBeta }
