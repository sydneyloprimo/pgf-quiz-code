'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { useConciergeContact } from '@/hooks/useConciergeContact'
import { cn } from '@/utils/cn'

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
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-neutral-950/80 to-transparent'
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10',
          'flex flex-col gap-4 md:gap-6',
          'items-center text-center',
          'px-5 md:px-24 desktop:px-32',
          'max-w-2xl mx-auto'
        )}
      >
        <div className="flex flex-col gap-2">
          <p className="font-sans text-sm md:text-base text-neutral-white/80">
            {t('subtitle')}
          </p>
          <h1
            className={cn(
              'font-display',
              'text-3xl md:text-5xl desktop:text-6xl',
              'leading-tight',
              'tracking-tight',
              'text-neutral-white'
            )}
          >
            {t('title')}
          </h1>
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
