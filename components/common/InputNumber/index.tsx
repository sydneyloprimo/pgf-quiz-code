'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes, ReactNode } from 'react'

import { DecrementIcon } from '@/components/common/DecrementIcon'
import { IncrementIcon } from '@/components/common/IncrementIcon'
import { cn } from '@/utils/cn'

const inputNumberVariants = cva('flex gap-4 items-center', {
  variants: {
    state: {
      default: '',
      disabled: '',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const buttonVariants = cva(
  'flex items-center justify-center border cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-800 border-primary-800 text-neutral-white hover:bg-primary-600 hover:border-primary-600 active:bg-primary-900 active:border-primary-900 focus:bg-primary-600 focus:border-primary-600 disabled:bg-neutral-100 disabled:border-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
        secondary:
          'bg-tertiary-800 border-tertiary-800 text-neutral-white hover:bg-tertiary-900 hover:border-tertiary-900 active:bg-tertiary-900 active:border-tertiary-900 focus:bg-tertiary-900 focus:border-tertiary-900 disabled:bg-neutral-100 disabled:border-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
        tertiary:
          'bg-neutral-white border-secondary-900 text-secondary-900 hover:bg-secondary-900 hover:text-neutral-white active:bg-secondary-950 active:text-neutral-white focus:bg-primary-200 focus:border-primary-200 focus:text-primary-800 disabled:bg-neutral-100 disabled:border-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
        ghost:
          'bg-transparent border-secondary-900 text-secondary-900 hover:bg-secondary-100 hover:border-secondary-900 active:bg-secondary-900 active:text-neutral-white focus:bg-primary-200 focus:border-primary-200 focus:text-primary-800 disabled:bg-neutral-100 disabled:border-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
        ghostWhite:
          'bg-transparent border-transparent text-neutral-white hover:border-secondary-600 hover:text-secondary-600 active:bg-secondary-900 active:border-secondary-900 focus:border-secondary-600 focus:text-secondary-600 disabled:bg-neutral-100 disabled:border-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
      },
      size: {
        large: 'p-3 gap-2',
        medium: 'p-3 gap-2',
        small: 'p-2 gap-1',
      },
    },
    defaultVariants: {
      variant: 'tertiary',
      size: 'large',
    },
  }
)

export type InputNumberVariantProps = VariantProps<typeof inputNumberVariants>
export type InputNumberButtonVariantProps = VariantProps<typeof buttonVariants>

interface InputNumberProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    InputNumberVariantProps {
  onDecrement?: () => void
  onIncrement?: () => void
  decrementIcon?: ReactNode
  incrementIcon?: ReactNode
  buttonVariant?: InputNumberButtonVariantProps['variant']
  buttonSize?: InputNumberButtonVariantProps['size']
  className?: string
}

const InputNumber = ({
  value,
  onDecrement,
  onIncrement,
  decrementIcon,
  incrementIcon,
  className,
  state,
  disabled,
  buttonVariant,
  buttonSize,
  min,
  max,
  ...props
}: InputNumberProps) => {
  const isDisabled = disabled || state === 'disabled'
  const textColor = isDisabled ? 'text-neutral-600' : 'text-neutral-900'

  const iconSize =
    buttonSize === 'small'
      ? 'size-4'
      : buttonSize === 'medium'
        ? 'size-5'
        : 'size-6'

  return (
    <div
      className={cn(
        inputNumberVariants({ state: isDisabled ? 'disabled' : state }),
        className
      )}
    >
      <button
        type="button"
        className={buttonVariants({
          variant: buttonVariant,
          size: buttonSize,
        })}
        onClick={onDecrement}
        disabled={isDisabled}
      >
        {decrementIcon || (
          <DecrementIcon className={iconSize} aria-hidden="true" />
        )}
      </button>
      <p className={cn('font-semibold leading-6 text-base', textColor)}>
        {value || 0}
      </p>
      <button
        type="button"
        className={buttonVariants({
          variant: buttonVariant,
          size: buttonSize,
        })}
        onClick={onIncrement}
        disabled={isDisabled}
      >
        {incrementIcon || (
          <IncrementIcon className={iconSize} aria-hidden="true" />
        )}
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={isDisabled}
        className="sr-only"
        {...props}
      />
    </div>
  )
}

export { InputNumber }
