'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { FAQItem } from './FAQItem'
import { SectionDivider } from './SectionDivider'

import { FAQS_DATA } from '@/constants'

const FAQSection = () => {
  const t = useTranslations('Home.FAQ')
  const [openIndex, setOpenIndex] = useState(0)

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }, [])

  const faqs = useMemo(
    () =>
      FAQS_DATA.map((faq) => ({
        question: t(faq.questionKey),
        answer: t(faq.answerKey),
      })),
    [t]
  )

  return (
    <section className="w-full px-5 pt-16 md:px-24 relative overflow-hidden">
      <div className="flex flex-col gap-12 items-center relative z-10">
        <SectionDivider />

        <h2 className="font-display text-3xl md:text-4xl leading-tight md:leading-12 tracking-tight text-secondary-950 text-center">
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

        <SectionDivider />
      </div>
    </section>
  )
}

export { FAQSection }
