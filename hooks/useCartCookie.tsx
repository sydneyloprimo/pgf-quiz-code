import { useEffect } from 'react'
import { useCookies } from 'react-cookie'

import { Cookies } from '@/types/enums/cookies'
import { client } from 'shopify/client'
import { useCartCreateMutation } from 'shopify/generated/graphql'

const useCartCookie = () => {
  const [cookies, setCookie] = useCookies([Cookies.cart])
  const { mutate: createCart } = useCartCreateMutation(client, {
    onSuccess: (data) => {
      console.log(data)
      setCookie(Cookies.cart, data.cartCreate?.cart?.id, {
        path: '/',
      })
    },
  })

  useEffect(() => {
    if (!cookies?.cart) {
      createCart({})
    }
  }, [cookies, createCart])
}

export default useCartCookie
