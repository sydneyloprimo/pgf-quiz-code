import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { client } from 'shopify/client'
import {
  useCartCreateMutation,
  useCartBuyerIdentityUpdateMutation,
  useGetCartQuery,
} from 'shopify/generated/graphql'

import { Cookies } from '@/types/enums/cookies'

const useCartCookie = () => {
  const [cookies, setCookie] = useCookies([
    Cookies.cart,
    Cookies.customerAccessToken,
  ])

  const { mutate: updateCartIdentity } =
    useCartBuyerIdentityUpdateMutation(client)

  const { mutate: createCart } = useCartCreateMutation(client, {
    onSuccess: (data) => {
      const newCartId = data.cartCreate?.cart?.id
      if (newCartId) {
        setCookie(Cookies.cart, newCartId, { path: '/' })
        const token = cookies[Cookies.customerAccessToken]
        if (token) {
          updateCartIdentity({
            buyerIdentity: { customerAccessToken: token },
            cartId: newCartId,
          })
        }
      }
    },
  })

  const { data } = useGetCartQuery(client, { id: cookies[Cookies.cart] })

  useEffect(() => {
    if (!cookies?.cart || (cookies?.cart && data?.cart === null)) {
      createCart({})
    }
  }, [cookies, createCart, data])

  return { cartId: cookies[Cookies.cart] || '' }
}

export default useCartCookie
