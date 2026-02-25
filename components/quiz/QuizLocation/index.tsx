'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'

import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Link } from '@/components/common/Link'
import { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import { BOSTON_AREA_ZIP_CODES, MIN_ZIP_CODE_LENGTH } from '@/constants'
import { useEmailCustomer } from '@/hooks/useEmailCustomer'
import { QuizStep } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'

interface QuizLocationProps {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
  formMethods: UseFormReturn<QuizFormData>
}

const QuizLocation = ({
  goToStep,
  goBack,
  canGoBack,
  formMethods,
}: QuizLocationProps) => {
  const router = useRouter()
  const t = useTranslations('Quiz.location')
  const tQuiz = useTranslations('Quiz')
  const tErrors = useTranslations('Common.EmailCustomer.errors')
  const { control } = formMethods
  const [zipValidated, setZipValidated] = useState<boolean | null>(null)
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')

  const handleSuccess = useCallback(() => {
    router.push(Routes.home)
  }, [router])

  const { createEmailCustomer, isLoading, error } =
    useEmailCustomer(handleSuccess)

  const handleContinue = useCallback(() => {
    const zip = formMethods.getValues('zipCode')?.trim() || ''
    const isValid =
      zip.length >= MIN_ZIP_CODE_LENGTH &&
      BOSTON_AREA_ZIP_CODES.has(zip.slice(0, MIN_ZIP_CODE_LENGTH))
    setZipValidated(isValid)
    if (isValid) {
      goToStep(QuizStep.PetInfo)
    }
  }, [formMethods, goToStep])

  const handleNotifyMe = useCallback(() => {
    setShowEmailInput(true)
  }, [])

  const handleEmailSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      createEmailCustomer({ email: notifyEmail })
    },
    [notifyEmail, createEmailCustomer]
  )

  const zipCode = useWatch({ control, name: 'zipCode', defaultValue: '' })
  const isZipEntered =
    String(zipCode ?? '').trim().length >= MIN_ZIP_CODE_LENGTH

  const translatedError = error ? tErrors(error) : undefined

  const handleChangeZip = useCallback(() => {
    setZipValidated(null)
    setShowEmailInput(false)
  }, [])

  const handleNotifyEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNotifyEmail(event.target.value)
    },
    []
  )

  if (zipValidated === false && showEmailInput) {
    return (
      <div className="flex flex-col items-center justify-center pt-0 w-full">
        <div className="flex flex-col gap-8 items-center w-full max-w-md pb-16">
          <div className="flex flex-col gap-4 items-center text-center w-full text-secondary-950">
            <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
              {t('heading')}
            </h2>
            <p className="font-body text-xl leading-8 w-full">
              {t('invalidZipMessage')}
            </p>
          </div>
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col gap-6 w-full"
          >
            <Input
              id="location-notify-email"
              name="location-notify-email"
              type="email"
              value={notifyEmail}
              onChange={handleNotifyEmailChange}
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              labelClassName="text-secondary-900 font-body text-base font-bold"
              error={translatedError}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !notifyEmail.trim()}
              className="w-full"
            >
              {t('notifyMeButton')}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              onClick={handleChangeZip}
              className="w-full"
            >
              {t('changeZipButton')}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  if (zipValidated === false) {
    return (
      <div className="flex flex-col items-center justify-center pt-0 w-full">
        <div className="flex flex-col gap-8 items-center w-full max-w-md pb-16">
          <div className="flex flex-col gap-4 items-center text-center w-full text-secondary-950">
            <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
              {t('heading')}
            </h2>
            <p className="font-body text-xl leading-8 w-full">
              {t('invalidZipMessage')}
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Button
              type="button"
              variant="primary"
              onClick={handleNotifyMe}
              className="w-full"
            >
              {t('notifyMeButton')}
            </Button>
            <Link href={Routes.home} className="w-full">
              <Button type="button" variant="tertiary" className="w-full">
                {t('checkBackButton')}
              </Button>
            </Link>
            <Button
              type="button"
              variant="tertiary"
              onClick={handleChangeZip}
              className="w-full"
            >
              {t('changeZipButton')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center pt-0 w-full">
      <div className="flex flex-col gap-12 items-center w-full pb-16">
        <div className="flex flex-col gap-6 items-center text-center w-full text-secondary-950">
          <h2 className="font-display text-4xl leading-12 tracking-tight w-full">
            {t('heading')}
          </h2>
          <p className="font-body text-xl leading-8 w-full">
            {t('description')}
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Controller
            name="zipCode"
            control={control}
            render={({
              field: { ref, name, value, onChange, onBlur },
              fieldState: { error },
            }) => {
              const handleZipInputChange = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => onChange(e.target.value)
              return (
                <Input
                  ref={ref}
                  name={name}
                  value={value || ''}
                  onChange={handleZipInputChange}
                  onBlur={onBlur}
                  label={t('zipLabel')}
                  placeholder={t('zipPlaceholder')}
                  error={error?.message}
                  inputMode="numeric"
                  maxLength={10}
                />
              )
            }}
          />
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleContinue}
        continueButtonText={tQuiz('continueButton')}
        continueDisabled={!isZipEntered}
      />
    </div>
  )
}

export { QuizLocation }
