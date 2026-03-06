'use client'

import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'
import { useMediaQuery } from 'usehooks-ts'
import { z } from 'zod'

import { AuthForm } from '@/components/auth/AuthForm'
import { LoginCloseButton } from '@/components/auth/LoginCloseButton'
import { LoginDivider } from '@/components/auth/LoginDivider'
import { SignUpFormCard } from '@/components/auth/SignUpFormCard'
import { SignUpHero } from '@/components/auth/SignUpHero'
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
        iconAlt="Success icon"
        title="Success"
      />,
      {
        className: 'md:max-w-lg border-restored border rounded-lg',
        position: isMobile ? 'top-center' : 'bottom-center',
      }
    )
  }

  const { apiError, clearApiError, isLoading, createCustomer, setCredentials } =
    useUserAccess(createSuccessCallback)

  const handleSubmit = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setCredentials({ email, password })
    createCustomer({
      input: {
        email,
        password,
        ...(firstName?.trim() && { firstName: firstName.trim() }),
        ...(lastName?.trim() && { lastName: lastName.trim() }),
      },
    })
  }

  const validationSchema = z.object({
    firstName: z.string().min(1, { message: t('firstNameRequired') }),
    lastName: z.string().min(1, { message: t('lastNameRequired') }),
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
    <div className="bg-quaternary-800 content-center flex flex-wrap gap-8 lg:gap-10 isolate items-center justify-center px-5 lg:px-24 pt-17 pb-10 lg:py-16 relative size-full min-h-screen overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 bg-[url(/images/login-pattern.svg)] bg-repeat bg-auto"
        aria-hidden="true"
      />
      <LoginCloseButton translationNamespace="SignUp" />
      <SignUpHero />
      <SignUpFormCard>
        <AuthForm
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText={t('buttonText')}
          apiError={apiError}
          clearApiError={clearApiError}
          validationSchema={validationSchema}
          redirectLinkHref={Routes.signin}
          showNameFields
        />
      </SignUpFormCard>
      <LoginDivider />
    </div>
  )
}
