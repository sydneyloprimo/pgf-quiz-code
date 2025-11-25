'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { ReactNode, useCallback, useState } from 'react'

import { CheckIcon, ChevronIcon } from '@/components/common/Icon'
import { getInputDropdownDisplayState } from '@/components/common/Input'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

const inputDropdownVariants = cva(
  'flex gap-2 items-start overflow-clip p-3 w-full text-base font-semibold leading-6',
  {
    variants: {
      state: {
        [InputDropdownState.Default]:
          'bg-neutral-white border border-neutral-950 text-neutral-800',
        [InputDropdownState.Filled]:
          'bg-neutral-white border border-secondary-900 text-secondary-950',
        [InputDropdownState.Open]:
          'bg-neutral-white border-2 border-primary-800 text-neutral-800',
      },
    },
    defaultVariants: {
      state: InputDropdownState.Default,
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
  const displayState = getInputDropdownDisplayState(
    disabled,
    isOpen,
    Boolean(selectedOption),
    state
  )

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }, [disabled, isOpen])

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      onSelect?.(optionValue)
      setIsOpen(false)
    },
    [onSelect]
  )

  return (
    <div className={cn('relative flex flex-col', className)}>
      <button
        type="button"
        className={cn(inputDropdownVariants({ state: displayState }))}
        onClick={handleToggle}
        disabled={disabled}
      >
        <p
          className={cn(
            'flex-1 min-w-0 font-semibold leading-6 text-base',
            'text-neutral-800 overflow-ellipsis overflow-hidden',
            'whitespace-nowrap text-left',
            {
              'text-secondary-950':
                selectedOption && displayState === InputDropdownState.Filled,
            }
          )}
        >
          {selectedOption?.label || placeholder}
        </p>
        {icon && <div className="relative shrink-0 size-6">{icon}</div>}
        <div className="relative shrink-0 size-6">
          <ChevronIcon direction={isOpen ? 'up' : 'down'} className="size-6" />
        </div>
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-12 left-0 right-0 z-10 bg-neutral-100 border-2 border-primary-800 flex flex-col">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'bg-neutral-white flex gap-2 items-center',
                'px-4 py-3 w-full cursor-pointer',
                'hover:bg-secondary-100',
                'text-base font-semibold leading-6 text-neutral-800'
              )}
              onClick={() => handleOptionSelect(option.value)}
            >
              <div className="flex-1 min-w-0 text-left">
                <p className="leading-6 whitespace-pre-wrap">{option.label}</p>
              </div>
              {option.value === value && (
                <div className="relative shrink-0 size-6">
                  <CheckIcon className="size-6 text-feedback-success-500" />
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
