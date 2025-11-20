'use client'

import cn from 'classnames'
import Link from 'next/link'
import { ComponentProps, PropsWithChildren } from 'react'

interface LinkProps extends PropsWithChildren {
  href: string
  className?: string
}

type LinkComponentProps = Omit<
  ComponentProps<typeof Link>,
  'href' | 'className' | 'children'
>

const CustomLink = ({
  children,
  className,
  href,
  ...props
}: LinkProps & LinkComponentProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-primary-600 text-sm font-bold md:text-base disabled:text-neutral-700 hover:underline active:underline active:text-primary-600 focus:outline-dashed focus:outline-2 focus:outline-primary-600 focus:rounded-lg focus:px-1.5',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export default CustomLink
