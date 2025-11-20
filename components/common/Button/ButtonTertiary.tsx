'use client'

import { ComponentProps, PropsWithChildren } from 'react'

import Button from './Button'

type ButtonTertiaryProps = PropsWithChildren &
  Omit<ComponentProps<typeof Button>, 'variant'>

const ButtonTertiary = ({ children, ...props }: ButtonTertiaryProps) => {
  return (
    <Button variant="tertiary" {...props}>
      {children}
    </Button>
  )
}

export default ButtonTertiary
