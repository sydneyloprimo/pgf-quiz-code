'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { useConciergeContact } from '@/hooks/useConciergeContact'

const FormulationHeroSection = () => {
  const t = useTranslations('Formulation.Hero')
  const tConcierge = useTranslations('Common.ConciergeLink')
  const { href: conciergeHref, isTabletOrLarger } = useConciergeContact()

  return (
    <section className="relative w-full h-96 md:h-120 flex items-center">
      {/* Background Image */}
      <Image
        src="/images/formulation/hero-bg.jpg"
        alt={t('backgroundAlt')}
        fill
        className="object-cover object-[center_25%]"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 gradient-hero-overlay"
        aria-hidden="true"
      />

      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/15" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-10 items-center text-center px-5 md:px-24 desktop:px-32 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="heading-h1 font-display tracking-wide text-neutral-100 [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] text-center">
            {t('title')}
          </h1>
          <p className="font-sans text-base font-normal leading-6 text-neutral-100 [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] text-center">
            {t('subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          href={conciergeHref}
          className="w-fit"
          aria-label={
            isTabletOrLarger
              ? tConcierge('emailAriaLabel')
              : tConcierge('phoneAriaLabel')
          }
        >
          {t('ctaButton')}
        </Button>
      </div>
    </section>
  )
}

export { FormulationHeroSection }
