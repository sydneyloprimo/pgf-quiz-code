'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import Card from '@/components/common/Card'
import { useSignIn } from '@/hooks/useSignIn'
import event from '@/scripts/GoogleTagManager/event'
import { Events, AuthenticationMethods } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'

export default function SignIn() {
  const t = useTranslations('SignIn')
  const { apiError, clearApiError, createAccessToken, isLoading } = useSignIn()

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
    email: z.string().min(1, { message: t('emailRequired') }),
    password: z.string().min(1, { message: t('passwordRequired') }),
  })

  return (
    <div className="flex flex-col gap-4">
      <AuthCard>
        <AuthForm
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText={t('buttonText')}
          apiError={apiError}
          clearApiError={clearApiError}
          validationSchema={validationSchema}
        />
      </AuthCard>
      <Card className="mx-4 md:mx-32">
        <div className="flex flex-col items-center gap-1">
          <div>{t('signupRedirectMessage')}</div>
          <Link className="w-full" href={Routes.signup}>
            <button className="btn-secondary w-full h-[44px]">
              {t('signupRedirectLink')}
            </button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
