'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslations } from 'next-intl'
import { ReactNode, useCallback, useId, useRef, useState } from 'react'

import { CheckIcon, ChevronIcon } from '@/components/common/Icon'
import { getInputDropdownDisplayState } from '@/components/common/Input'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

const inputDropdownVariants = cva(
  'flex gap-2 items-start overflow-clip p-3 w-full text-base font-body font-semibold leading-6',
  {
    variants: {
      state: {
        [InputDropdownState.Default]:
          'bg-neutral-white border border-neutral-950',
        [InputDropdownState.Filled]:
          'bg-neutral-white border border-secondary-900',
        [InputDropdownState.Open]:
          'bg-neutral-white border border-primary-800 shadow-focus-primary',
      },
    },
    defaultVariants: {
      state: InputDropdownState.Default,
    },
  }
)

export type BreedDropdownVariantProps = VariantProps<
  typeof inputDropdownVariants
>

export interface BreedOption {
  value: string
  labelKey?: string
  categoryKey?: string
  label?: string
  category?: string
}

interface BreedDropdownProps extends BreedDropdownVariantProps {
  value?: string
  placeholder?: string
  breeds: BreedOption[]
  onSelect?: (value: string) => void
  className?: string
  icon?: ReactNode
  disabled?: boolean
  textClassName?: string
  onOpen?: () => void
  onClose?: () => void
}

const BreedDropdown = ({
  value,
  placeholder,
  breeds,
  onSelect,
  className,
  icon,
  state,
  disabled,
  textClassName,
  onOpen,
  onClose,
}: BreedDropdownProps) => {
  const tCommon = useTranslations('Common.InputDropdown')
  const t = useTranslations('Quiz.breedSelection')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedBreed = breeds.find((breed) => breed.value === value)
  const displayState = getInputDropdownDisplayState(
    disabled,
    isOpen,
    Boolean(selectedBreed),
    state
  )

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      onSelect?.(optionValue)
      setIsOpen(false)
    },
    [onSelect]
  )

  const handleToggle = useCallback(() => {
    if (disabled) return
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (newIsOpen) {
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
  }, [disabled, isOpen, onOpen, onClose])

  const getLabel = useCallback(
    (breed: BreedOption) => {
      if (breed.label) return breed.label
      if (breed.labelKey) return t(breed.labelKey)
      return ''
    },
    [t]
  )
  const getCategory = useCallback(
    (breed: BreedOption) => {
      if (breed.category) return breed.category
      if (breed.categoryKey) return t(breed.categoryKey)
      return ''
    },
    [t]
  )

  const breedsByCategory = breeds.reduce(
    (acc, breed) => {
      const categoryLabel = getCategory(breed)
      if (!acc[categoryLabel]) {
        acc[categoryLabel] = []
      }
      acc[categoryLabel].push(breed)
      return acc
    },
    {} as Record<string, BreedOption[]>
  )

  const categories = Object.keys(breedsByCategory)

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
        aria-label={placeholder || tCommon('selectOption')}
      >
        <p
          className={cn(
            'flex-1 min-w-0 font-body font-semibold leading-6 text-base',
            'overflow-ellipsis overflow-hidden',
            'whitespace-nowrap text-left',
            selectedBreed ? 'text-secondary-950' : 'text-neutral-800',
            textClassName
          )}
        >
          {selectedBreed ? getLabel(selectedBreed) : placeholder}
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
          className="absolute top-12 left-0 right-0 z-10 bg-neutral-white border border-primary-800 shadow-focus-primary flex flex-col max-h-60 overflow-y-auto gap-1"
        >
          {categories.map((category) => (
            <div key={category} className="flex flex-col">
              <div className="px-4 pt-3">
                <p className="font-body font-bold leading-5 text-base text-secondary-950 pb-2">
                  {category}
                </p>
              </div>
              {breedsByCategory[category].map((breed) => (
                <button
                  key={breed.value}
                  type="button"
                  role="option"
                  aria-selected={breed.value === value}
                  className={cn(
                    'bg-neutral-white flex gap-2 items-center',
                    'px-4 py-3 w-full cursor-pointer',
                    'hover:bg-secondary-100',
                    'text-base font-body leading-6 text-secondary-950'
                  )}
                  onClick={() => handleOptionSelect(breed.value)}
                >
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-body leading-6 whitespace-pre-wrap">
                      {getLabel(breed)}
                    </p>
                  </div>
                  {breed.value === value && (
                    <div className="relative shrink-0 size-6">
                      <CheckIcon className="size-6 text-feedback-success-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { BreedDropdown }
