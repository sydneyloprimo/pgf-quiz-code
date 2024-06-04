import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

import { client } from '@/shopify/client'
import {
  useCartBuyerIdentityUpdateMutation,
  useCustomerAccessTokenCreateMutation,
} from '@/shopify/generated/graphql'
import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'

export const useSignIn = () => {
  const [apiError, setApiError] = useState<string>('')
  const { push } = useRouter()
  const [cookies, setCookie] = useCookies([
    Cookies.customerAccessToken,
    Cookies.cart,
  ])

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

  return { apiError, clearApiError, createAccessToken, isLoading }
}
