'use client'

import { useCallback } from 'react'

import { MinusIcon, PlusIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface IngredientItemProps {
  iconSrc: string
  name: string
  description: string
  isOpen: boolean
  onToggle: () => void
  toggleAriaLabel: string
}

export const IngredientItem = ({
  iconSrc,
  name,
  description,
  isOpen,
  onToggle,
  toggleAriaLabel,
}: IngredientItemProps) => {
  const handleToggle = useCallback(() => {
    onToggle()
  }, [onToggle])

  return (
    <div
      className={cn(
        'w-full',
        'border-b border-tertiary-200',
        isOpen && 'bg-neutral-200 border border-quaternary-200'
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full',
          'py-6 px-6',
          'flex items-center justify-between',
          'text-left'
        )}
        aria-expanded={isOpen}
        aria-label={toggleAriaLabel}
      >
        <div className="flex items-center gap-5">
          <h3
            className={cn(
              'font-display',
              'text-2xl leading-8',
              'font-bold',
              'text-quaternary-800'
            )}
          >
            {name}
          </h3>
        </div>
        {isOpen ? (
          <MinusIcon className="w-6 h-6 text-quaternary-800 cursor-pointer" />
        ) : (
          <PlusIcon className="w-6 h-6 text-quaternary-800 cursor-pointer" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p
            className={cn(
              'font-sans',
              'text-lg leading-normal',
              'font-normal',
              'text-secondary-950'
            )}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
