'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { ComponentProps, PropsWithChildren } from 'react'

import { cn } from '@/utils/cn'

const optionSelectVariants = cva(
  'flex gap-2 items-center justify-center p-3 text-xl font-bold leading-8',
  {
    variants: {
      state: {
        default:
          'bg-neutral-white border border-secondary-800 text-secondary-950',
        hover: 'bg-secondary-200 text-secondary-900',
        active:
          'bg-secondary-100 border-2 border-secondary-600 text-secondary-950',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export type OptionSelectVariantProps = VariantProps<typeof optionSelectVariants>

interface OptionSelectProps
  extends PropsWithChildren,
    OptionSelectVariantProps,
    Omit<ComponentProps<'button'>, 'className'> {
  className?: string
}

const OptionSelect = ({
  children,
  className,
  state,
  ...props
}: OptionSelectProps) => {
  return (
    <button
      className={cn(optionSelectVariants({ state }), className)}
      {...props}
    >
      {children}
    </button>
  )
}

export { OptionSelect }
