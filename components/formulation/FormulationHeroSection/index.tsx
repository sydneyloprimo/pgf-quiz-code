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
        className="object-cover object-[center_25%]"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-[linear-gradient(0deg,rgba(204,204,204,0)_-36.31%,rgba(106,43,0,0.6)_100%)]'
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10',
          'flex flex-col gap-10',
          'items-center text-center',
          'px-5 md:px-24 desktop:px-32',
          'max-w-2xl mx-auto'
        )}
      >
        <div className="flex flex-col gap-2">
          <h1
            className={cn(
              'font-display',
              'text-[48px]',
              'leading-[56px]',
              'tracking-[1.44px]',
              'text-neutral-100',
              '[text-shadow:0_4px_4px_rgba(0,0,0,0.25)]',
              'text-center'
            )}
          >
            {t('title')}
          </h1>
          <p
            className={cn(
              'font-sans',
              'text-base',
              'font-normal',
              'leading-6',
              'text-neutral-100',
              '[text-shadow:0_4px_4px_rgba(0,0,0,0.25)]',
              'text-center'
            )}
          >
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
