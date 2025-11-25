'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import React from 'react'

import { InputIconPosition } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

const inputVariants = cva(
  'flex gap-2 items-start overflow-clip p-3 w-full text-base font-body font-semibold leading-6',
  {
    variants: {
      state: {
        default: 'bg-neutral-white border border-neutral-950 text-neutral-800',
        active: 'bg-neutral-white border-2 border-primary-800 text-neutral-800',
        filled:
          'bg-neutral-white border border-secondary-900 text-secondary-950',
        disabled: 'bg-neutral-600 border border-neutral-700 text-neutral-800',
        focus: 'bg-neutral-white border-2 border-neutral-950 text-neutral-800',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export type InputVariantProps = VariantProps<typeof inputVariants>

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>,
    InputVariantProps {
  label?: string | ReactNode
  labelClassName?: string
  inputClassName?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  iconPosition?: InputIconPosition.Start | InputIconPosition.End
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      labelClassName,
      value,
      onChange,
      className,
      inputClassName,
      onBlur,
      onFocus,
      error,
      placeholder,
      type,
      icon,
      iconPosition = InputIconPosition.Start,
      name,
      state,
      disabled,
      ...props
    }: InputProps,
    ref
  ) => {
    const isFilled = Boolean(value)
    const [isFocused, setIsFocused] = React.useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const displayState = disabled
      ? 'disabled'
      : error
        ? 'default'
        : isFocused
          ? state === 'focus'
            ? 'focus'
            : 'active'
          : isFilled
            ? 'filled'
            : state || 'default'

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {label && (
          <label className={labelClassName} htmlFor={name || id}>
            {label}
          </label>
        )}
        <div className="relative flex flex-col">
          <div
            className={cn(
              inputVariants({ state: displayState }),
              error && 'border-secondary-900',
              inputClassName
            )}
          >
            {icon && iconPosition === InputIconPosition.Start && (
              <div className="relative shrink-0 size-6">{icon}</div>
            )}
            <input
              ref={ref}
              id={id}
              className={cn(
                'flex-1 min-w-0 font-body font-semibold leading-6 text-base',
                'text-secondary-950 placeholder-shown:text-neutral-800',
                'overflow-ellipsis overflow-hidden',
                'whitespace-nowrap bg-transparent border-0 outline-0',
                'placeholder:text-neutral-800 px-0',
                disabled && 'cursor-not-allowed'
              )}
              type={type}
              name={name}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled}
              {...props}
            />
            {icon && iconPosition === InputIconPosition.End && (
              <div className="relative shrink-0 size-6">{icon}</div>
            )}
          </div>
          {isFocused && displayState === 'focus' && (
            <div className="absolute border-2 border-secondary-900 inset-[-2px] pointer-events-none" />
          )}
        </div>
        {error && (
          <span role="alert" className="text-secondary-900 text-sm">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
