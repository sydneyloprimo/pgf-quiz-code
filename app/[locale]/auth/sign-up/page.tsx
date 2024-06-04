'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'
import { z } from 'zod'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import Toast, { ToastTypes } from '@/components/common/Toast'
import { MediaQuery } from '@/constants'
import { useSignIn } from '@/hooks/useSignIn'
import event from '@/scripts/GoogleTagManager/event'
import { client } from '@/shopify/client'
import { useCustomerCreateMutation } from '@/shopify/generated/graphql'
import { Events, AuthenticationMethods } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'
import { passwordRegExp } from '@/utils/utils'

export default function SignUp() {
  const t = useTranslations('SignUp')
  const { push } = useRouter()
  const isMobile = useMediaQuery(MediaQuery.mobile)
  const [apiError, setApiError] = useState<string>('')
  const {
    apiError: signInApiError,
    clearApiError: clearSignInApiError,
    createAccessToken,
    isLoading: isSignInLoading,
  } = useSignIn()

  const [credentials, setCredentials] = useState<{
    email: string
    password: string
  } | null>(null)

  const clearApiError = () => {
    setApiError('')
    clearSignInApiError()
  }

  const { mutate: createCustomer, isLoading: isSignUpLoading } =
    useCustomerCreateMutation(client, {
      onSuccess: (data) => {
        event(Events.signUp, { method: AuthenticationMethods.email })
        if (data.customerCreate?.customer?.id) {
          setApiError('')
          if (credentials) {
            createAccessToken({ input: credentials })
          } else {
            push(Routes.signin)
          }
          toast(
            <Toast
              type={ToastTypes.success}
              description={t('successfulRegistration')}
            />,
            {
              className: 'md:max-w-lg border-restored border rounded-lg',
              position: isMobile ? 'top-center' : 'bottom-center',
            }
          )
        } else if (data?.customerCreate?.customerUserErrors) {
          setApiError(data?.customerCreate?.customerUserErrors[0]?.message)
        }
      },
    })

  const handleSubmit = async (email: string, password: string) => {
    setCredentials({ email, password })
    createCustomer({
      input: {
        email: email,
        password: password,
      },
    })
  }

  const validationSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('emailRequired') })
      .email({
        message: t('emailPattern'),
      }),
    password: z
      .string()
      .regex(passwordRegExp, t('passwordPattern'))
      .min(8, { message: t('passwordLength') }),
  })

  return (
    <AuthCard
      footer={
        <div className="flex justify-center gap-1">
          <span>{t('signinRedirectMessage')}</span>
          <Link className="link-primary" href={Routes.signin}>
            {t('signinRedirectLink')}
          </Link>
        </div>
      }
    >
      <AuthForm
        handleSubmit={handleSubmit}
        isLoading={isSignUpLoading || isSignInLoading}
        buttonText={t('buttonText')}
        apiError={apiError || signInApiError}
        validationSchema={validationSchema}
        clearApiError={clearApiError}
      />
    </AuthCard>
  )
}
