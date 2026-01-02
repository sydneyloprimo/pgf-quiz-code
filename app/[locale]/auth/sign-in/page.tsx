'use client'

import { useTranslations } from 'next-intl'
import { z } from 'zod'

import AuthForm from '@/components/auth/AuthForm'
import { LoginCloseButton } from '@/components/auth/LoginCloseButton'
import { LoginDivider } from '@/components/auth/LoginDivider'
import { LoginFormCard } from '@/components/auth/LoginFormCard'
import { LoginHero } from '@/components/auth/LoginHero'
import { useUserAccess } from '@/hooks/useUserAccess'
import event from '@/scripts/GoogleTagManager/event'
import { Events, AuthenticationMethods } from '@/types/enums/events'

export default function SignIn() {
  const t = useTranslations('SignIn')
  const { apiError, clearApiError, createAccessToken, isLoading } =
    useUserAccess()

  const handleSubmit = async (email: string, password: string) => {
    event(Events.login, { method: AuthenticationMethods.email })
    createAccessToken({
      input: {
        email: email,
        password: password,
      },
    })
  }

  const validationSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: t('emailRequired') }),
    password: z
      .string()
      .trim()
      .min(1, { message: t('passwordRequired') }),
  })

  return (
    <div className="bg-quaternary-800 content-center flex flex-wrap gap-8 lg:gap-10 isolate items-center justify-center px-5 lg:px-24 pt-17 pb-10 lg:py-16 relative size-full min-h-screen overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 bg-[url(/images/login-pattern.svg)] bg-repeat bg-auto"
        aria-hidden="true"
      />
      <LoginCloseButton />
      <LoginHero />
      <LoginFormCard>
        <AuthForm
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText={t('buttonText')}
          apiError={apiError}
          clearApiError={clearApiError}
          validationSchema={validationSchema}
        />
      </LoginFormCard>
      <LoginDivider />
    </div>
  )
}
