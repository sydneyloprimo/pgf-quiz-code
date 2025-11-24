'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes, ReactNode } from 'react'

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

export type InputNumberVariantProps = VariantProps<typeof inputNumberVariants>

interface InputNumberProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    InputNumberVariantProps {
  onDecrement?: () => void
  onIncrement?: () => void
  decrementIcon?: ReactNode
  incrementIcon?: ReactNode
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
  min,
  max,
  ...props
}: InputNumberProps) => {
  const isDisabled = disabled || state === 'disabled'
  const buttonBg = isDisabled ? 'bg-neutral-100' : 'bg-neutral-white'
  const buttonBorder = isDisabled
    ? 'border-neutral-100'
    : 'border-secondary-900'
  const textColor = isDisabled ? 'text-neutral-600' : 'text-neutral-900'
  const iconColor = isDisabled ? 'text-neutral-500' : 'text-secondary-900'

  const defaultDecrementIcon = (
    <svg
      className={cn('size-5', iconColor)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )

  const defaultIncrementIcon = (
    <svg
      className={cn('size-5', iconColor)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )

  return (
    <div
      className={cn(
        inputNumberVariants({ state: isDisabled ? 'disabled' : state }),
        className
      )}
    >
      <button
        type="button"
        className={cn(
          buttonBg,
          buttonBorder,
          'flex gap-2 items-center justify-center p-3 border',
          'cursor-pointer',
          isDisabled && 'cursor-not-allowed'
        )}
        onClick={onDecrement}
        disabled={isDisabled}
      >
        {decrementIcon || defaultDecrementIcon}
      </button>
      <p className={cn('font-semibold leading-6 text-base', textColor)}>
        {value || 0}
      </p>
      <button
        type="button"
        className={cn(
          buttonBg,
          buttonBorder,
          'flex gap-2 items-center justify-center p-3 border',
          'cursor-pointer',
          isDisabled && 'cursor-not-allowed'
        )}
        onClick={onIncrement}
        disabled={isDisabled}
      >
        {incrementIcon || defaultIncrementIcon}
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
