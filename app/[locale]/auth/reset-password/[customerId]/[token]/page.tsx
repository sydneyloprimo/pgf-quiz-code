'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { LoginCloseButton } from '@/components/auth/LoginCloseButton'
import { LoginDivider } from '@/components/auth/LoginDivider'
import { LoginFormCard } from '@/components/auth/LoginFormCard'
import { LoginHero } from '@/components/auth/LoginHero'
import { Button } from '@/components/common/Button'
import { VisibilityIcon, VisibilityOffIcon } from '@/components/common/Icon'
import Input from '@/components/common/Input'
import Spinner from '@/components/common/Spinner'
import { client } from '@/shopify/client'
import {
  CustomerErrorCode,
  useCartBuyerIdentityUpdateMutation,
  useCustomerResetMutation,
} from '@/shopify/generated/graphql'
import { InputIconPosition } from '@/types/enums/constants'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'
import { passwordRegExp } from '@/utils/utils'

const TRANSLATION_NAMESPACE = 'ResetPassword'

export default function ResetPassword() {
  const t = useTranslations(TRANSLATION_NAMESPACE)
  const { push } = useRouter()
  const params = useParams<{
    customerId: string
    token: string
  }>()
  const [cookies, setCookie] = useCookies([
    Cookies.customerAccessToken,
    Cookies.cart,
  ])
  const [apiError, setApiError] = useState('')
  const [isTokenError, setIsTokenError] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validationSchema = z
    .object({
      newPassword: z.string().superRefine((val, ctx) => {
        if (!val || val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('newPasswordRequired'),
          })
          return
        }
        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('newPasswordMinLength'),
          })
          return
        }
        if (!passwordRegExp.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('passwordPattern'),
          })
        }
      }),
      confirmPassword: z.string().min(1, {
        message: t('confirmPasswordRequired'),
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('passwordsDoNotMatch'),
      path: ['confirmPassword'],
    })

  type FormData = z.infer<typeof validationSchema>

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  const { mutate: updateCartIdentity } =
    useCartBuyerIdentityUpdateMutation(client)

  const { mutate: resetCustomer, isPending } = useCustomerResetMutation(
    client,
    {
      onSuccess: (data) => {
        const token = data.customerReset?.customerAccessToken?.accessToken
        const userErrors = data.customerReset?.customerUserErrors

        if (token) {
          setApiError('')
          updateCartIdentity({
            buyerIdentity: {
              customerAccessToken: token,
            },
            cartId: cookies[Cookies.cart],
          })
          setCookie(Cookies.customerAccessToken, token, { secure: true })
          push(Routes.home)
        } else if (userErrors?.length) {
          const errorCode = userErrors[0]?.code
          if (errorCode === CustomerErrorCode.TokenInvalid) {
            setIsTokenError(true)
          } else {
            setApiError(t('errors.generic'))
          }
        } else {
          setApiError(t('errors.generic'))
        }
      },
      onError: () => {
        setApiError(t('errors.generic'))
      },
    }
  )

  const onSubmit = useCallback(
    (data: FormData) => {
      const shopifyCustomerId = `gid://shopify/Customer/${params.customerId}`

      resetCustomer({
        id: shopifyCustomerId,
        input: {
          resetToken: params.token,
          password: data.newPassword,
        },
      })
    },
    [resetCustomer, params.customerId, params.token]
  )

  const toggleNewPassword = useCallback(() => {
    setShowNewPassword((prev) => !prev)
  }, [])

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  return (
    <div className="bg-quaternary-800 content-center flex flex-wrap gap-8 lg:gap-10 isolate items-center justify-center px-5 lg:px-24 pt-17 pb-10 lg:py-16 relative size-full min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30 bg-[url(/images/login-pattern.svg)] bg-repeat bg-auto"
        aria-hidden="true"
      />
      <LoginCloseButton translationNamespace={TRANSLATION_NAMESPACE} />
      <LoginHero translationNamespace={TRANSLATION_NAMESPACE} />
      <LoginFormCard translationNamespace={TRANSLATION_NAMESPACE}>
        {isTokenError ? (
          <div className="flex flex-col gap-6 items-center text-center">
            <p className="text-body-m text-feedback-error-500">
              {t('errors.expired')}
            </p>
            <Link
              href={Routes.forgotPassword}
              className="text-body-m font-bold text-primary-600 underline"
            >
              {t('backToForgotPasswordLink')}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full"
          >
            {apiError && (
              <p className="text-body-s text-feedback-error-500">{apiError}</p>
            )}
            <div className="flex flex-col gap-4">
              <Controller
                name="newPassword"
                control={control}
                render={({
                  field: { ref, name, value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <Input
                    ref={ref}
                    label={t('newPasswordLabel')}
                    labelClassName="text-body-m font-bold text-secondary-900"
                    type={showNewPassword ? 'text' : 'password'}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    icon={
                      <button
                        type="button"
                        onClick={toggleNewPassword}
                        aria-label={
                          showNewPassword
                            ? t('hidePassword')
                            : t('showPassword')
                        }
                        className="flex items-center justify-center"
                      >
                        {showNewPassword ? (
                          <VisibilityOffIcon className="size-6 text-secondary-950" />
                        ) : (
                          <VisibilityIcon className="size-6 text-secondary-950" />
                        )}
                      </button>
                    }
                    iconPosition={InputIconPosition.End}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({
                  field: { ref, name, value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <Input
                    ref={ref}
                    label={t('confirmPasswordLabel')}
                    labelClassName="text-body-m font-bold text-secondary-900"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    icon={
                      <button
                        type="button"
                        onClick={toggleConfirmPassword}
                        aria-label={
                          showConfirmPassword
                            ? t('hidePassword')
                            : t('showPassword')
                        }
                        className="flex items-center justify-center"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon className="size-6 text-secondary-950" />
                        ) : (
                          <VisibilityIcon className="size-6 text-secondary-950" />
                        )}
                      </button>
                    }
                    iconPosition={InputIconPosition.End}
                  />
                )}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!isValid || isPending}
              aria-label={t('submitAriaLabel')}
            >
              {isPending ? <Spinner /> : t('buttonText')}
            </Button>
          </form>
        )}
      </LoginFormCard>
      <LoginDivider />
    </div>
  )
}
