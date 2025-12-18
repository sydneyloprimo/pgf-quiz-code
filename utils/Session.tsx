'use client'
import useCartCookie from 'hooks/useCartCookie'
import { PropsWithChildren } from 'react'


const Session = ({ children }: PropsWithChildren) => {
  useCartCookie()

  return <>{children}</>
}

export default Session
