'use client'


import { MinusIcon, PlusIcon } from '@/components/common/Icon'

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
  return (
    <div className={'w-full border-b-2 border-tertiary-400'}>
      <button
        type="button"
        onClick={onToggle}
        className={'w-full py-6 flex items-center justify-between text-left'}
        aria-expanded={isOpen}
        aria-label={toggleAriaLabel}
      >
        <div className={'flex items-center'}>
          <h4
            className={
              'font-sans text-xl leading-8 font-semibold text-quaternary-800'
            }
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
            className={
              'font-sans text-base leading-7 font-normal text-secondary-950 min-h-[1rem]'
            }
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}
