'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { LoginCloseButton } from '@/components/auth/LoginCloseButton'
import { LoginDivider } from '@/components/auth/LoginDivider'
import { LoginFormCard } from '@/components/auth/LoginFormCard'
import { LoginHero } from '@/components/auth/LoginHero'
import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import Spinner from '@/components/common/Spinner'
import { client } from '@/shopify/client'
import { useCustomerRecoverMutation } from '@/shopify/generated/graphql'
import { Routes } from '@/types/enums/routes'

const TRANSLATION_NAMESPACE = 'ForgotPassword'

export default function ForgotPassword() {
  const t = useTranslations(TRANSLATION_NAMESPACE)
  const tAuth = useTranslations('Auth')
  const [isSuccess, setIsSuccess] = useState(false)

  const validationSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t('emailRequired') }),
  })

  type FormData = z.infer<typeof validationSchema>

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: { email: '' },
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  const { mutate: recoverCustomer, isPending } = useCustomerRecoverMutation(
    client,
    {
      onSuccess: () => {
        setIsSuccess(true)
      },
      onError: () => {
        // Show success state on error to avoid leaking account existence
        setIsSuccess(true)
      },
    }
  )

  const onSubmit = useCallback(
    (data: FormData) => {
      recoverCustomer({ email: data.email })
    },
    [recoverCustomer]
  )

  return (
    <div className="bg-quaternary-800 content-center flex flex-wrap gap-8 lg:gap-10 isolate items-center justify-center px-5 lg:px-24 pt-17 pb-10 lg:py-16 relative size-full min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30 bg-[url(/images/login-pattern.svg)] bg-repeat bg-auto"
        aria-hidden="true"
      />
      <LoginCloseButton translationNamespace={TRANSLATION_NAMESPACE} />
      <LoginHero translationNamespace={TRANSLATION_NAMESPACE} />
      <LoginFormCard translationNamespace={TRANSLATION_NAMESPACE}>
        {isSuccess ? (
          <div className="flex flex-col gap-6 items-center text-center">
            <h3 className="heading-h4 text-neutral-950">
              {t('successHeading')}
            </h3>
            <p className="text-body-m text-secondary-900">
              {t('successMessage')}
            </p>
            <Link
              href={Routes.signin}
              className="text-body-m font-bold text-primary-600 underline"
            >
              {t('backToLoginLink')}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full"
          >
            <Controller
              name="email"
              control={control}
              render={({
                field: { ref, name, value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <Input
                  ref={ref}
                  label={tAuth('email')}
                  labelClassName="text-body-m font-bold text-secondary-900"
                  type="email"
                  value={value}
                  name={name}
                  placeholder={tAuth('emailPlaceholder')}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                />
              )}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!isValid || isPending}
              aria-label={t('submitAriaLabel')}
            >
              {isPending ? <Spinner /> : t('buttonText')}
            </Button>
            <div className="flex justify-center">
              <Link
                href={Routes.signin}
                className="text-body-m text-secondary-900 underline"
              >
                {t('backToLoginLink')}
              </Link>
            </div>
          </form>
        )}
      </LoginFormCard>
      <LoginDivider />
    </div>
  )
}
