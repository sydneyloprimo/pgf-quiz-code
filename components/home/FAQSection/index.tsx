'use client'

import Image from 'next/image'
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
        'font-display',
        'text-xl md:text-3xl',
        'leading-tight md:leading-10',
        'tracking-tight',
        'cursor-pointer',
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

const SectionDivider = () => (
  <div className="flex items-center justify-center w-full gap-4 md:gap-6">
    <div className="flex-1 h-px bg-secondary-300" />
    <Image
      src="/icons/faq-divider.svg"
      alt=""
      width={43}
      height={47}
      className="w-8 h-9 md:w-10 md:h-11"
    />
    <div className="flex-1 h-px bg-secondary-300" />
  </div>
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
        'px-5 md:px-24',
        'py-28 md:py-32',
        'relative overflow-hidden'
      )}
    >
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <Image
          src="/images/home/faq-right-veggie.svg"
          alt=""
          width={60}
          height={68}
          className="absolute w-44 h-60"
          style={{
            left: '94%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <Image
          src="/images/home/faq-pepper-right.svg"
          alt=""
          width={60}
          height={46}
          className="absolute w-15 h-11"
          style={{
            left: '90%',
            top: '75%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <Image
          src="/images/home/faq-pepper-left.svg"
          alt=""
          width={60}
          height={68}
          className="absolute w-15 h-17"
          style={{
            left: '10%',
            top: '35%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <Image
          src="/images/home/faq-left-veggie.svg"
          alt=""
          width={100}
          height={68}
          className="absolute w-40 h-44"
          style={{ left: '4%', top: '70%', transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <div className={cn('flex flex-col gap-12 items-center', 'relative z-10')}>
        <SectionDivider />

        <h2
          className={cn(
            'font-display',
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

        <SectionDivider />
      </div>
    </section>
  )
}

export { FAQSection }
