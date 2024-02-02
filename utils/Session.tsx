'use client'
import { PropsWithChildren } from 'react'

import useCartCookie from 'hooks/useCartCookie'

const Session = ({ children }: PropsWithChildren) => {
  useCartCookie()

  return <>{children}</>
}

export default Session
