'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import { FAQItem } from './FAQItem'

import {
  FAQ_ITEMS,
  FORMULATION_SECTION_PADDING_X,
  FORMULATION_SECTION_PADDING_Y,
} from '@/constants'
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
        FORMULATION_SECTION_PADDING_X,
        FORMULATION_SECTION_PADDING_Y,
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
              key={faq.questionKey}
              question={t(faq.questionKey)}
              answer={t(faq.answerKey)}
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
