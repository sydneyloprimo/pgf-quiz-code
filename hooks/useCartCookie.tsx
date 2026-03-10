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
  const [cookies, setCookie] = useCookies([Cookies.cart])
  const [tokenCookies] = useCookies([Cookies.customerAccessToken])

  const { mutate: updateCartIdentity } =
    useCartBuyerIdentityUpdateMutation(client)

  const { mutate: createCart } = useCartCreateMutation(client, {
    onSuccess: (data) => {
      const newCartId = data.cartCreate?.cart?.id
      if (newCartId) {
        setCookie(Cookies.cart, newCartId, { path: '/' })
        const token = tokenCookies[Cookies.customerAccessToken]
        if (token) {
          updateCartIdentity({
            buyerIdentity: { customerAccessToken: token },
            cartId: newCartId,
          })
        }
      }
    },
  })

  const cartCookie = cookies[Cookies.cart]

  const { data } = useGetCartQuery(client, { id: cartCookie })

  useEffect(() => {
    if (!cartCookie || (cartCookie && data?.cart === null)) {
      createCart({})
    }
  }, [cartCookie, createCart, data])

  return { cartId: cartCookie || '' }
}

export default useCartCookie
