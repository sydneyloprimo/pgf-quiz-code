'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { FAQItem } from './FAQItem'

import { FAQ_ITEMS } from '@/constants'
import { cn } from '@/utils/cn'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(-1)
  const t = useTranslations('Formulation.UnderstandingFormulation')

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  return (
    <section
      className={cn(
        'w-full',
        'px-5 py-14',
        'lg:px-24 py-16 lg:py-[200px]',
        'md:px-24 md:pt-24 md:pb-36',
        'bg-neutral-300'
      )}
    >
      <div className="w-full">
        <h2
          className={cn(
            'font-display',
            'text-[2.5rem] leading-12',
            'font-normal',
            'text-quaternary-800',
            'mb-6'
          )}
        >
          {t('title')}
        </h2>

        <div className="flex flex-col">
          {FAQ_ITEMS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              toggleAriaLabel="Toggle FAQ answer"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { FAQSection }
