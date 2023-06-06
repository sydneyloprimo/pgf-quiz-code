'use client'
import cn from 'classnames'
import React, { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
}

const Input = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type,
  icon,
  iconPosition = 'start',
  name,
  ...props
}: InputProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  }

  return (
    <div className="flex flex-col mb-3">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex flex-col relative items-center">
        {icon && iconPosition === 'start' && (
          <div className="absolute top-[0.9rem] left-4">{icon}</div>
        )}
        <input
          id={id}
          className={cn(
            'h-[44px] rounded-lg border border-solid border-black p-3 w-full',
            error && 'border-red-500'
          )}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          {...props}
        />
        {icon && iconPosition === 'end' && (
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

export default Input
