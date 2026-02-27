'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslations } from 'next-intl'
import { ReactNode, useCallback, useEffect, useId, useRef } from 'react'

import { CheckIcon, ChevronIcon } from '@/components/common/Icon'
import { getInputDropdownDisplayState } from '@/components/common/Input'
import { useInputDropdownContext } from '@/components/common/InputDropdown/InputDropdownContext'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

const inputDropdownVariants = cva(
  'flex gap-2 items-start overflow-clip p-3 w-full text-base font-body font-semibold leading-6',
  {
    variants: {
      state: {
        [InputDropdownState.Default]:
          'bg-neutral-white border border-neutral-950 text-neutral-black',
        [InputDropdownState.Filled]:
          'bg-neutral-white border border-secondary-900 text-neutral-black',
        [InputDropdownState.Open]:
          'bg-neutral-white border border-primary-800 shadow-focus-primary text-neutral-black',
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
  textClassName?: string
  onOpen?: () => void
  onClose?: () => void
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
  textClassName,
  onOpen,
  onClose,
}: InputDropdownProps) => {
  const t = useTranslations('Common.InputDropdown')
  const { toggleDropdown, isOpen: isDropdownOpen } = useInputDropdownContext()
  const dropdownId = useId()
  const dropdownInstanceId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((opt) => opt.value === value)
  const isOpen = isDropdownOpen(dropdownInstanceId)
  const displayState = getInputDropdownDisplayState(
    disabled,
    isOpen,
    Boolean(selectedOption),
    state
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        toggleDropdown(dropdownInstanceId)
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, toggleDropdown, dropdownInstanceId, onClose])

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      onSelect?.(optionValue)
      toggleDropdown(dropdownInstanceId)
      onClose?.()
    },
    [onSelect, toggleDropdown, dropdownInstanceId, onClose]
  )

  const handleToggle = useCallback(() => {
    if (disabled) return
    const willBeOpen = !isOpen
    toggleDropdown(dropdownInstanceId)
    if (willBeOpen) {
      onOpen?.()
      window.requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      })
    } else {
      onClose?.()
    }
  }, [disabled, isOpen, toggleDropdown, dropdownInstanceId, onOpen, onClose])

  return (
    <div
      ref={containerRef}
      className={cn('relative flex flex-col scroll-mb-10', className)}
    >
      <button
        type="button"
        className={cn(inputDropdownVariants({ state: displayState }))}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={dropdownId}
        aria-label={placeholder || t('selectOption')}
      >
        <p
          className={cn(
            'flex-1 min-w-0 font-body font-semibold leading-6 text-base',
            'text-neutral-black overflow-ellipsis overflow-hidden',
            'whitespace-nowrap text-left',
            textClassName
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
        <div
          id={dropdownId}
          role="listbox"
          className="absolute top-12 left-0 right-0 z-10 bg-neutral-100 border border-primary-800 shadow-focus-primary flex flex-col max-h-60 overflow-y-auto"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={cn(
                'bg-neutral-white flex gap-2 items-center',
                'px-4 py-3 w-full cursor-pointer',
                'hover:bg-secondary-100',
                'text-base font-body font-semibold leading-6 text-neutral-black'
              )}
              onClick={() => handleOptionSelect(option.value)}
            >
              <div className="flex-1 min-w-0 text-left">
                <p className="font-body leading-6 whitespace-pre-wrap">
                  {option.label}
                </p>
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
