'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCookies } from 'react-cookie'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import Card from '@/components/common/Card'
import { client } from '@/shopify/client'
import { useCustomerAccessTokenCreateMutation } from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'
import { isEmailValid, isPasswordValid } from '@/utils/utils'

export default function SignIn() {
  const t = useTranslations('SignIn')
  const { push } = useRouter()
  const [, setCookie] = useCookies([Cookies.customerAccessToken])

  const {
    mutate: createAccessToken,
    isLoading,
    data,
  } = useCustomerAccessTokenCreateMutation(client, {
    onSuccess: (data) => {
      if (data.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
        setCookie(
          Cookies.customerAccessToken,
          data.customerAccessTokenCreate?.customerAccessToken?.accessToken
        )
        push(Routes.home)
      }
    },
  })

  const handleSubmit = async (email: string, password: string) => {
    if (!!isEmailValid(email) && !!isPasswordValid(password)) {
      createAccessToken({
        input: {
          email: email,
          password: password,
        },
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AuthCard>
        <AuthForm
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText={t('buttonText')}
          error={
            data?.customerAccessTokenCreate?.customerUserErrors[0]?.message ||
            ''
          }
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
