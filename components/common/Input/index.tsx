'use client'
import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import React from 'react'

import { InputIconPosition } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode
  labelClassName?: string
  inputClassName?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  iconPosition?: InputIconPosition.Start | InputIconPosition.End
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
      iconPosition = InputIconPosition.Start,
      name,
      ...props
    }: InputProps,
    ref
  ) => (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label className={labelClassName} htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex flex-col relative items-center">
        {icon && (
          <div
            className={cn(
              'absolute top-2 cursor-pointer p-1',
              iconPosition === InputIconPosition.End ? 'right-3' : ' left-3'
            )}
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-11 rounded-lg border border-solid border-black p-3 w-full',
            error ? 'border-red-500' : undefined,
            iconPosition === InputIconPosition.End
              ? icon
                ? 'pr-9'
                : undefined
              : icon
                ? 'pl-9'
                : undefined,
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
      </div>
      {error && (
        <span role="alert" className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  )
)

Input.displayName = 'Input'

export default Input
