import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

import { client } from '@/shopify/client'
import {
  useCartBuyerIdentityUpdateMutation,
  useCustomerAccessTokenCreateMutation,
  useCustomerCreateMutation,
} from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { AuthenticationMethods, Events } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'
import { trackEvent } from '@/utils/analytics'

export const useUserAccess = (createSuccessCallback?: () => void) => {
  const [apiError, setApiError] = useState<string>('')
  const { push } = useRouter()
  const [cookies, setCookie] = useCookies([
    Cookies.customerAccessToken,
    Cookies.cart,
  ])

  const [credentials, setCredentials] = useState<{
    email: string
    password: string
  } | null>(null)

  const { mutate: updateCartIdentity } =
    useCartBuyerIdentityUpdateMutation(client)

  const { mutate: createAccessToken, isPending: isSignInLoading } =
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

  const { mutate: createCustomer, isPending: isSignUpLoading } =
    useCustomerCreateMutation(client, {
      onSuccess: (data) => {
        trackEvent(Events.signUp, { method: AuthenticationMethods.email })
        if (data.customerCreate?.customer?.id) {
          setApiError('')
          if (credentials) {
            createAccessToken({ input: credentials })
          } else {
            push(Routes.signin)
          }
          createSuccessCallback?.()
        } else if (data?.customerCreate?.customerUserErrors) {
          setApiError(data?.customerCreate?.customerUserErrors[0]?.message)
        }
      },
    })

  const clearApiError = () => setApiError('')

  return {
    apiError,
    clearApiError,
    createAccessToken,
    createCustomer,
    isLoading: isSignInLoading || isSignUpLoading,
    setCredentials,
  }
}
