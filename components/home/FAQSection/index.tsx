'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

import { FAQItem } from './FAQItem'
import { SectionDivider } from './SectionDivider'

import { ContentfulImage } from '@/components/common/ContentfulImage'
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
    <section className="w-full px-5 md:px-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <ContentfulImage
          src="/images/home/faq-right-veggie.svg"
          alt={t('decorativeRightVeggieAlt')}
          width={60}
          height={68}
          className="absolute w-44 h-60"
          style={{
            left: '94%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <ContentfulImage
          src="/images/home/faq-pepper-right.svg"
          alt={t('decorativeRightPepperAlt')}
          width={60}
          height={46}
          className="absolute w-15 h-11"
          style={{
            left: '90%',
            top: '75%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <ContentfulImage
          src="/images/home/faq-pepper-left.svg"
          alt={t('decorativeLeftPepperAlt')}
          width={60}
          height={68}
          className="absolute w-15 h-17"
          style={{
            left: '10%',
            top: '35%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <ContentfulImage
          src="/images/home/faq-left-veggie.svg"
          alt={t('decorativeLeftVeggieAlt')}
          width={100}
          height={68}
          className="absolute w-40 h-44"
          style={{ left: '4%', top: '70%', transform: 'translate(-50%, -50%)' }}
        />
      </div>

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
