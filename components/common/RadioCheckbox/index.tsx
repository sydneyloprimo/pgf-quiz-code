'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

const radioCheckboxVariants = cva('flex gap-1 items-center', {
  variants: {
    type: {
      radio: '',
      checkbox: '',
    },
    size: {
      large: '',
      small: '',
    },
    state: {
      default: '',
      disabled: '',
    },
  },
  defaultVariants: {
    type: 'radio',
    size: 'large',
    state: 'default',
  },
})

export type RadioCheckboxVariantProps = VariantProps<
  typeof radioCheckboxVariants
>

interface RadioCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    RadioCheckboxVariantProps {
  label?: string | ReactNode
  className?: string
  labelClassName?: string
}

const RadioCheckbox = ({
  label,
  className,
  labelClassName,
  type = 'radio',
  size = 'large',
  state,
  checked,
  disabled,
  id,
  name,
  ...props
}: RadioCheckboxProps) => {
  const isDisabled = disabled || state === 'disabled'
  const inputSize = size === 'large' ? 'size-4' : 'size-3'
  const textSize = size === 'large' ? 'text-base' : 'text-sm'
  const textColor = isDisabled ? 'text-neutral-600' : 'text-neutral-black'

  if (type === 'radio') {
    return (
      <label
        htmlFor={id}
        className={cn(
          radioCheckboxVariants({ type, size, state }),
          !isDisabled && 'cursor-pointer',
          className
        )}
      >
        <div className="flex flex-col gap-2 items-center p-1">
          <div
            className={cn(
              'relative',
              inputSize,
              checked
                ? isDisabled
                  ? 'bg-neutral-300'
                  : 'bg-secondary-600'
                : isDisabled
                  ? 'border border-neutral-300'
                  : 'border border-secondary-600',
              'rounded-full'
            )}
          >
            {checked && (
              <div
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'rounded-full',
                  size === 'large' ? 'size-2' : 'size-1.5',
                  'bg-neutral-white'
                )}
              />
            )}
          </div>
        </div>
        {label && (
          <span
            className={cn(
              'font-normal leading-5 whitespace-nowrap',
              textSize,
              textColor,
              labelClassName
            )}
          >
            {label}
          </span>
        )}
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          disabled={isDisabled}
          className="sr-only"
          {...props}
        />
      </label>
    )
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        radioCheckboxVariants({ type, size, state }),
        !isDisabled && 'cursor-pointer',
        className
      )}
    >
      <div className="flex flex-col gap-2 items-center p-1">
        <div
          className={cn(
            'flex flex-col gap-2 items-center justify-center',
            'rounded',
            inputSize,
            checked
              ? isDisabled
                ? 'bg-neutral-300'
                : 'bg-secondary-600'
              : isDisabled
                ? 'border border-neutral-300'
                : 'border border-secondary-600'
          )}
        >
          {checked && (
            <div className="relative shrink-0 size-[10px]">
              <svg
                className="size-[10px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                  className="text-neutral-white"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      {label && (
        <span
          className={cn(
            'font-normal leading-5 whitespace-nowrap',
            textSize,
            textColor,
            labelClassName
          )}
        >
          {label}
        </span>
      )}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={isDisabled}
        className="sr-only"
        {...props}
      />
    </label>
  )
}

export { RadioCheckbox }
