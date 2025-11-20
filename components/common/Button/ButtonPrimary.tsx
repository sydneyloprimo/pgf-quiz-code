'use client'

import { ComponentProps, PropsWithChildren } from 'react'

import Button from './Button'

type ButtonPrimaryProps = PropsWithChildren &
  Omit<ComponentProps<typeof Button>, 'variant'>

const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <Button variant="primary" {...props}>
      {children}
    </Button>
  )
}

export default ButtonPrimary
