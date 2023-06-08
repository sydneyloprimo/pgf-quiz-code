'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import { client } from '@/shopify/client'
import { useCustomerCreateMutation } from '@/shopify/generated/graphql'
import { Routes } from '@/types/enums/routes'
import { isEmailValid, isPasswordValid } from '@/utils/utils'

export default function SignUp() {
  const t = useTranslations('SignUp')
  const { push } = useRouter()

  const {
    mutate: createCustomer,
    isLoading,
    data,
  } = useCustomerCreateMutation(client, {
    onSuccess: (data) => {
      if (data.customerCreate?.customer?.id) {
        push(Routes.signin)
      }
    },
  })

  const handleSubmit = async (email: string, password: string) => {
    if (!!isEmailValid(email) && !!isPasswordValid(password)) {
      createCustomer({
        input: {
          email: email,
          password: password,
        },
      })
    }
  }

  return (
    <AuthCard
      footer={
        <div className="flex justify-center gap-1">
          <span>{t('signinRedirectMessage')}</span>
          <Link className="text-links" href={Routes.signin}>
            {t('signinRedirectLink')}
          </Link>
        </div>
      }
    >
      <AuthForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText={t('buttonText')}
        error={data?.customerCreate?.customerUserErrors[0]?.message || ''}
      />
    </AuthCard>
  )
}
