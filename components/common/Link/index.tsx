import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { ComponentProps, PropsWithChildren } from 'react'

import { cn } from '@/utils/cn'

const linkVariants = cva(
  'underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]',
  {
    variants: {
      variant: {
        primary:
          'text-primary-800 hover:text-primary-600 active:text-primary-900 focus:text-primary-600 focus:border focus:border-primary-900 focus:rounded-sm disabled:text-neutral-800',
        secondary:
          'text-secondary-900 hover:text-secondary-700 focus:text-secondary-500 focus:border focus:border-secondary-900 focus:rounded-sm disabled:text-neutral-800',
        tertiary:
          'text-quaternary-100 hover:text-quaternary-500 active:text-neutral-900 focus:text-neutral-700 focus:border focus:border-neutral-700 focus:rounded-sm disabled:text-neutral-800',
      },
      size: {
        large: 'text-base leading-4 font-bold',
        small: 'text-sm leading-none font-normal',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  }
)

export type LinkVariantProps = VariantProps<typeof linkVariants>

interface LinkProps extends PropsWithChildren, LinkVariantProps {
  href: string
  className?: string
}

type LinkComponentProps = Omit<
  ComponentProps<typeof Link>,
  'href' | 'className' | 'children' | 'variant' | 'size'
>

const CustomLink = ({
  children,
  className,
  href,
  variant,
  size,
  ...props
}: LinkProps & LinkComponentProps) => {
  return (
    <Link
      href={href}
      className={cn(linkVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export { CustomLink as Link }
