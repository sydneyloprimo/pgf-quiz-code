'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { cn } from '@/utils/cn'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full max-w-3xl',
      'border-b border-tertiary-200',
      'pb-8 md:pb-9 pt-3',
      'flex flex-col gap-3',
      'text-center'
    )}
    aria-expanded={isOpen}
  >
    <h3
      className={cn(
        'font-display font-semibold',
        'text-xl md:text-3xl',
        'leading-tight md:leading-10',
        'tracking-tight',
        isOpen ? 'text-secondary-800' : 'text-secondary-900'
      )}
    >
      {question}
    </h3>
    {isOpen && (
      <p
        className={cn(
          'font-sans text-base md:text-lg leading-6 md:leading-7',
          'text-secondary-950',
          'pl-5 md:pl-8'
        )}
      >
        {answer}
      </p>
    )}
  </button>
)

const FAQSection = () => {
  const t = useTranslations('Home.FAQ')
  const [openIndex, setOpenIndex] = useState(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer'),
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer'),
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer'),
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer'),
    },
  ]

  return (
    <section
      className={cn(
        'w-full',
        'border-b border-secondary-300',
        'px-5 md:px-24',
        'py-28 md:py-32',
        'relative overflow-hidden'
      )}
    >
      <div className={cn('flex flex-col gap-12 items-center', 'relative z-10')}>
        <h2
          className={cn(
            'font-display font-semibold',
            'text-3xl md:text-4xl',
            'leading-tight md:leading-12',
            'tracking-tight',
            'text-secondary-950',
            'text-center'
          )}
        >
          {t('title')}
        </h2>

        <div className="flex flex-col gap-4 items-center w-full">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { FAQSection }
