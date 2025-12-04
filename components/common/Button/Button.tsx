import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps, PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'flex items-center justify-center gap-2 font-bold font-sans cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-800 text-neutral-white hover:bg-primary-600 active:bg-primary-900 focus:bg-primary-600 disabled:bg-neutral-700 disabled:border disabled:border-neutral-900 disabled:text-neutral-900',
        secondary:
          'bg-tertiary-800 text-neutral-white hover:bg-tertiary-900 hover:text-tertiary-100 focus:bg-tertiary-900 focus:text-neutral-white disabled:bg-neutral-700 disabled:border disabled:border-neutral-900 disabled:text-neutral-900',
        tertiary:
          'bg-neutral-white border border-secondary-900 text-secondary-900 hover:bg-secondary-900 hover:text-neutral-white active:bg-secondary-950 active:text-neutral-white focus:bg-secondary-900 focus:text-neutral-white disabled:bg-neutral-700 disabled:border disabled:border-neutral-900 disabled:text-neutral-900',
        ghost:
          'bg-transparent text-secondary-950 hover:text-primary-800 focus:border-2 focus:border-primary-500 focus:text-primary-600 disabled:bg-neutral-100 disabled:text-neutral-500',
      },
      size: {
        large: 'px-4 py-4 text-base leading-5 tracking-wide',
        medium: 'px-4 py-3 text-sm leading-5 tracking-wide',
        small: 'px-2 py-1 text-xs leading-5 tracking-wide',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

interface ButtonProps extends PropsWithChildren, ButtonVariantProps {
  href?: string
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  leftIcon?: ReactNode
}

type ButtonHTMLProps = Omit<
  ComponentProps<'button'>,
  'variant' | 'size' | 'href' | 'disabled' | 'className' | 'type'
>

const Button = ({
  children,
  className,
  variant,
  size,
  disabled,
  href,
  leftIcon,
  ...props
}: ButtonProps & ButtonHTMLProps) => {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (href) {
    const { type, ...linkProps } = props as any
    return (
      <Link href={href} className={classes} {...linkProps}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
    </button>
  )
}

export { Button }
