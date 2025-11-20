'use client'

import { ComponentProps, PropsWithChildren } from 'react'

import Button from './Button'

type ButtonOutlineProps = PropsWithChildren &
  Omit<ComponentProps<typeof Button>, 'variant'>

const ButtonOutline = ({ children, ...props }: ButtonOutlineProps) => {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  )
}

export default ButtonOutline
