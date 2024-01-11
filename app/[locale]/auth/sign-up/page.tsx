'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import event from '@/scripts/GoogleTagManager/event'
import { client } from '@/shopify/client'
import { useCustomerCreateMutation } from '@/shopify/generated/graphql'
import { Events, AuthenticationMethods } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'
import { passwordRegExp } from '@/utils/utils'

export default function SignUp() {
  const t = useTranslations('SignUp')
  const { push } = useRouter()

  const {
    mutate: createCustomer,
    isLoading,
    data,
  } = useCustomerCreateMutation(client, {
    onSuccess: (data) => {
      event(Events.signUp, { method: AuthenticationMethods.email })
      if (data.customerCreate?.customer?.id) {
        push(Routes.signin)
      }
    },
  })

  const handleSubmit = async (email: string, password: string) => {
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
        apiError={data?.customerCreate?.customerUserErrors[0]?.message || ''}
        validationSchema={validationSchema}
      />
    </AuthCard>
  )
}
