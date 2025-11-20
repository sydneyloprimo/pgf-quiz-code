'use client'

import cn from 'classnames'
import Link from 'next/link'
import { ComponentProps, PropsWithChildren } from 'react'

interface ButtonProps extends PropsWithChildren {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline'
  asChild?: boolean
  href?: string
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

type ButtonHTMLProps = Omit<
  ComponentProps<'button'>,
  'variant' | 'asChild' | 'href' | 'disabled' | 'className' | 'type'
>

const Button = ({
  children,
  className,
  variant = 'primary',
  disabled,
  asChild,
  href,
  ...props
}: ButtonProps & ButtonHTMLProps) => {
  const baseClasses =
    'rounded-md text-base flex items-center justify-center outline-1 focus:outline-dashed focus:outline-2 focus:outline-primary-600 hover:bg-primary-700 hover:outline-none disabled:cursor-not-allowed disabled:text-neutral-700 disabled:outline-none active:bg-primary-600 active:outline-primary-400 active:outline'

  const variantClasses = {
    primary:
      'px-5 outline text-white outline-white bg-neutral-950 disabled:bg-neutral-300',
    secondary:
      'px-5 outline text-black outline-black bg-white hover:text-white active:text-white disabled:bg-neutral-300',
    tertiary:
      'inline-flex gap-2 px-4 py-2 text-white bg-tertiary-500 hover:bg-tertiary-700 disabled:opacity-50',
    outline:
      'inline-flex gap-2 px-4 py-2 border border-neutral-950 text-neutral-black bg-transparent hover:bg-neutral-100 disabled:opacity-50',
  }

  const classes = cn(baseClasses, variantClasses[variant], className)

  if (href) {
    const { type, ...linkProps } = props as any
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
