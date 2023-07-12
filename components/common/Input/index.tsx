'use client'
import cn from 'classnames'
import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import React from 'react'

import { InputIconPosition } from '@/types/enums/constants'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode
  labelClassName?: string
  inputClassName?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  iconPosition?: InputIconPosition.START | InputIconPosition.END
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
      error,
      placeholder,
      type,
      icon,
      iconPosition = InputIconPosition.START,
      name,
      ...props
    }: InputProps,
    ref
  ) => {
    return (
      <div className={cn('flex flex-col', className)}>
        {label && (
          <label className={labelClassName} htmlFor={name}>
            {label}
          </label>
        )}
        <div className="flex flex-col relative items-center">
          {icon && iconPosition === InputIconPosition.START && (
            <div className="absolute top-[0.9rem] left-4">{icon}</div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'h-[44px] rounded-lg border border-solid border-black p-3 w-full',
              error && 'border-red-500',
              inputClassName
            )}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            {...props}
          />
          {icon && iconPosition === InputIconPosition.END && (
            <div className="absolute top-[0.9rem] right-4">{icon}</div>
          )}
        </div>
        {error && (
          <span role="alert" className="text-red-500 text-sm">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
