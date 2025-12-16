import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { client } from 'shopify/client'
import {
  useCartCreateMutation,
  useGetCartQuery,
} from 'shopify/generated/graphql'

import { Cookies } from '@/types/enums/cookies'

const useCartCookie = () => {
  const [cookies, setCookie] = useCookies([Cookies.cart])

  const { mutate: createCart } = useCartCreateMutation(client, {
    onSuccess: (data) => {
      setCookie(Cookies.cart, data.cartCreate?.cart?.id, {
        path: '/',
      })
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
