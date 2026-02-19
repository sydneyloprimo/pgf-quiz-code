'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes, ReactNode } from 'react'

import { DecrementIcon, IncrementIcon } from '@/components/common/Icon'
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
  'flex items-center justify-center border border-solid cursor-pointer shrink-0 p-3',
  {
    variants: {
      state: {
        default:
          'bg-neutral-white border-secondary-900 hover:bg-secondary-100 active:bg-secondary-100 focus:outline-none',
        disabled: 'bg-neutral-100 border-neutral-100 cursor-not-allowed',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export type InputNumberVariantProps = VariantProps<typeof inputNumberVariants>

interface InputNumberProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    InputNumberVariantProps {
  onDecrement?: () => void
  onIncrement?: () => void
  decrementIcon?: ReactNode
  incrementIcon?: ReactNode
  className?: string
  decrementAriaLabel?: string
  incrementAriaLabel?: string
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
  min,
  max,
  decrementAriaLabel = 'Decrease quantity',
  incrementAriaLabel = 'Increase quantity',
  ...props
}: InputNumberProps) => {
  const isDisabled = disabled || state === 'disabled'
  const buttonState = isDisabled ? 'disabled' : 'default'
  const textColor = isDisabled ? 'text-neutral-600' : 'text-neutral-900'
  const decrementIconColor = isDisabled
    ? 'text-neutral-200'
    : 'text-secondary-900'
  const incrementIconColor = isDisabled
    ? 'text-neutral-200'
    : 'text-primary-600'

  return (
    <div
      className={cn(
        inputNumberVariants({ state: isDisabled ? 'disabled' : state }),
        className
      )}
    >
      <button
        type="button"
        className={buttonVariants({ state: buttonState })}
        onClick={onDecrement}
        disabled={isDisabled}
        aria-label={decrementAriaLabel}
      >
        {decrementIcon || (
          <DecrementIcon
            className={cn('size-5', decrementIconColor)}
            aria-hidden="true"
          />
        )}
      </button>
      <p
        className={cn(
          'font-sans font-bold leading-6 text-base shrink-0',
          textColor
        )}
      >
        {value || 0}
      </p>
      <button
        type="button"
        className={buttonVariants({ state: buttonState })}
        onClick={onIncrement}
        disabled={isDisabled}
        aria-label={incrementAriaLabel}
      >
        {incrementIcon || (
          <IncrementIcon
            className={cn('size-5', incrementIconColor)}
            aria-hidden="true"
          />
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
