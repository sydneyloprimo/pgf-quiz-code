'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { ReactNode, useState } from 'react'

import { cn } from '@/utils/cn'

const inputDropdownVariants = cva(
  'flex gap-2 items-start overflow-clip p-3 w-full text-base font-semibold leading-6',
  {
    variants: {
      state: {
        default: 'bg-neutral-white border border-neutral-950 text-neutral-800',
        filled:
          'bg-neutral-white border border-secondary-900 text-secondary-950',
        open: 'bg-neutral-white border-2 border-primary-800 text-neutral-800',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export type InputDropdownVariantProps = VariantProps<
  typeof inputDropdownVariants
>

interface DropdownItem {
  label: string
  value: string
  checked?: boolean
}

interface InputDropdownProps extends InputDropdownVariantProps {
  value?: string
  placeholder?: string
  options: DropdownItem[]
  onSelect?: (value: string) => void
  className?: string
  icon?: ReactNode
  disabled?: boolean
}

const InputDropdown = ({
  value,
  placeholder,
  options,
  onSelect,
  className,
  icon,
  state,
  disabled,
}: InputDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((opt) => opt.value === value)
  const displayState = disabled
    ? 'default'
    : isOpen
      ? 'open'
      : selectedOption
        ? 'filled'
        : state || 'default'

  return (
    <div className={cn('relative flex flex-col', className)}>
      <button
        type="button"
        className={cn(inputDropdownVariants({ state: displayState }))}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <p
          className={cn(
            'flex-1 min-w-0 font-semibold leading-6 text-base',
            'text-neutral-800 overflow-ellipsis overflow-hidden',
            'whitespace-nowrap text-left',
            selectedOption && displayState === 'filled' && 'text-secondary-950'
          )}
        >
          {selectedOption?.label || placeholder}
        </p>
        {icon && <div className="relative shrink-0 size-6">{icon}</div>}
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-[46px] left-0 right-0 z-10 bg-neutral-100 border-2 border-primary-800 flex flex-col">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'bg-neutral-white flex gap-[10px] items-center',
                'px-4 py-3 w-full cursor-pointer',
                'hover:bg-secondary-100',
                'text-base font-semibold leading-6 text-neutral-800'
              )}
              onClick={() => {
                onSelect?.(option.value)
                setIsOpen(false)
              }}
            >
              <div className="flex-1 min-w-0 text-left">
                <p className="leading-6 whitespace-pre-wrap">{option.label}</p>
              </div>
              {option.checked && (
                <div className="relative shrink-0 size-6">
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      className="text-feedback-success-500"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { InputDropdown }
