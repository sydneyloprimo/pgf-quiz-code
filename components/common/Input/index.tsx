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
              'absolute top-[0.5rem] cursor-pointer p-1',
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
            'h-[44px] rounded-lg border border-solid border-black p-3 w-full',
            error && 'border-red-500',
            iconPosition === InputIconPosition.End
              ? icon && 'pr-9'
              : icon && 'pl-9',
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
