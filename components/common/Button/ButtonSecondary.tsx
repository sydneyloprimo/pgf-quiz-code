'use client'

import { ComponentProps, PropsWithChildren } from 'react'

import Button from './Button'

type ButtonSecondaryProps = PropsWithChildren &
  Omit<ComponentProps<typeof Button>, 'variant'>

const ButtonSecondary = ({ children, ...props }: ButtonSecondaryProps) => {
  return (
    <Button variant="secondary" {...props}>
      {children}
    </Button>
  )
}

export default ButtonSecondary
