'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { CheckIcon, PhoneIcon } from '@/components/common/Icon'
import { useConciergeContact } from '@/hooks/useConciergeContact'
import { Routes } from '@/types/enums/routes'

interface ThankYouContentProps {
  dogName: string
}

const ThankYouContent = ({ dogName }: ThankYouContentProps) => {
  const t = useTranslations('ThankYou')
  const { href: conciergeHref, isTabletOrLarger } = useConciergeContact()

  const handleConciergeClick = useCallback(() => {
    window.open(conciergeHref, '_blank')
  }, [conciergeHref])

  return (
    <div className="flex flex-col items-center gap-16 w-full max-w-2xl py-12">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="relative">
          <div className="opacity-90 w-80 h-40 overflow-hidden">
            <Image
              src="/images/thank-you-bowl-illustration.png"
              alt={t('bowlImageAlt')}
              width={309}
              height={150}
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>
          <div className="absolute -top-4 -right-4 flex items-center justify-center size-16 bg-feedback-success-500 rounded-2xl">
            <CheckIcon className="size-10 text-neutral-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 max-w-xl text-center text-secondary-950 w-full">
          <h2 className="font-display text-3xl leading-10 md:text-4xl md:leading-12 tracking-tight w-full">
            {t('heading')}
          </h2>
          <p className="font-body text-xl leading-8 w-full">
            {t('description', { name: dogName })}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
        <Button
          variant="tertiary"
          className="w-full md:w-auto min-w-64 order-2 md:order-1"
          onClick={handleConciergeClick}
          aria-label={
            isTabletOrLarger ? t('emailAriaLabel') : t('phoneAriaLabel')
          }
        >
          {t('chatWithConcierge')}
          <PhoneIcon className="size-5" />
        </Button>
        <Button
          variant="primary"
          href={Routes.profile}
          className="w-full md:w-64 order-1 md:order-2"
        >
          {t('backToProfile')}
        </Button>
      </div>
    </div>
  )
}

export { ThankYouContent }
