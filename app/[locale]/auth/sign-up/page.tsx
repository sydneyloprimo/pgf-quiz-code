'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'
import { z } from 'zod'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import Toast, { ToastTypes } from '@/components/common/Toast'
import { MediaQuery } from '@/constants'
import { useUserAccess } from '@/hooks/useUserAccess'
import { Routes } from '@/types/enums/routes'
import { passwordRegExp } from '@/utils/utils'

export default function SignUp() {
  const t = useTranslations('SignUp')
  const isMobile = useMediaQuery(MediaQuery.mobile)

  const createSuccessCallback = () => {
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
  }

  const { apiError, clearApiError, isLoading, createCustomer, setCredentials } =
    useUserAccess(createSuccessCallback)

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
        isLoading={isLoading}
        buttonText={t('buttonText')}
        apiError={apiError}
        validationSchema={validationSchema}
        clearApiError={clearApiError}
      />
    </AuthCard>
  )
}
