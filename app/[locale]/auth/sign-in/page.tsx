'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { z } from 'zod'

import AuthCard from '@/components/auth/AuthCard'
import AuthForm from '@/components/auth/AuthForm'
import Card from '@/components/common/Card'
import event from '@/scripts/GoogleTagManager/event'
import { client } from '@/shopify/client'
import {
  useCustomerAccessTokenCreateMutation,
  useCartBuyerIdentityUpdateMutation,
} from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Events, AuthenticationMethods } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'

export default function SignIn() {
  const t = useTranslations('SignIn')
  const { push } = useRouter()
  const [cookies, setCookie] = useCookies([
    Cookies.customerAccessToken,
    Cookies.cart,
  ])
  const [apiError, setApiError] = useState<string>('')

  const { mutate: updateCartIdentity } =
    useCartBuyerIdentityUpdateMutation(client)

  const { mutate: createAccessToken, isLoading } =
    useCustomerAccessTokenCreateMutation(client, {
      onSuccess: (data, { input }) => {
        if (data.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
          setApiError('')
          updateCartIdentity({
            buyerIdentity: {
              customerAccessToken:
                data.customerAccessTokenCreate?.customerAccessToken
                  ?.accessToken,
              email: input.email,
            },
            cartId: cookies[Cookies.cart],
          })
          setCookie(
            Cookies.customerAccessToken,
            data.customerAccessTokenCreate?.customerAccessToken?.accessToken,
            { secure: true }
          )
          push(Routes.home)
        } else if (data?.customerAccessTokenCreate?.customerUserErrors) {
          setApiError(
            data?.customerAccessTokenCreate?.customerUserErrors[0]?.message
          )
        }
      },
    })

  const clearApiError = () => setApiError('')

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
