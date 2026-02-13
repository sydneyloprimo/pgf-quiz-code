'use client'

import { useCallback } from 'react'

import { MinusIcon, PlusIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  toggleAriaLabel: string
}

export const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  toggleAriaLabel,
}: FAQItemProps) => {
  const handleToggle = useCallback(() => {
    onToggle()
  }, [onToggle])

  return (
    <div className={cn('w-full', 'border-b', 'border-tertiary-400')}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full',
          'py-6 ',
          'flex items-center justify-between',
          'text-left'
        )}
        aria-expanded={isOpen}
        aria-label={toggleAriaLabel}
      >
        <div className={cn('flex items-center', 'gap-0')}>
          <h4
            className={cn(
              'font-display',
              'text-xl leading-8',
              'font-normal',
              'text-quaternary-800'
            )}
          >
            {question}
          </h4>
        </div>
        <span className="flex flex-col items-center justify-center border-b border-tertiary-400 pb-1">
          {isOpen ? (
            <MinusIcon className="w-6 h-6 text-quaternary-800 cursor-pointer" />
          ) : (
            <PlusIcon className="w-6 h-6 text-quaternary-800 cursor-pointer" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p
            className={cn(
              'font-sans',
              'text-base leading-7',
              'font-normal',
              'text-secondary-950',
              'min-h-[1rem]'
            )}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}
