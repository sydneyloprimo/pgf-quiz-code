'use client'

import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import { useConciergeContact } from '@/hooks/useConciergeContact'
import { useVideoAutoPlay } from '@/hooks/useVideoAutoPlay'
import { cn } from '@/utils/cn'

const HeroSection = () => {
  const t = useTranslations('Home.Hero')
  const tConcierge = useTranslations('Common.ConciergeLink')
  const { href: conciergeHref, isTabletOrLarger } = useConciergeContact()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useVideoAutoPlay(videoRef)

  return (
    <section className="relative w-full md:min-h-180 h-96 md:max-h-none flex items-end md:items-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-1"
        poster="/images/home/hero-bg.jpg"
        aria-label={t('imageAlt')}
        width="100%"
        height="100%"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-neutral-950 opacity-60 z-2"
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10',
          'flex flex-col gap-2 md:gap-8',
          'px-5 md:px-11 py-6 md:py-12',
          'md:px-12',
          'desktop:px-32',
          'max-w-2xl'
        )}
      >
        <h1
          className={cn(
            'font-display',
            'text-xl md:text-5xl desktop:text-6xl',
            'leading-tight',
            'tracking-tight',
            'text-neutral-white',
            'w-4/5 md:w-full'
          )}
        >
          {t('headline')}
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Button
            variant="primary"
            href="/quiz"
            className="w-full md:w-auto px-4 py-4"
          >
            {t('ctaButton')}
          </Button>

          <Link
            href={conciergeHref}
            size="large"
            className="font-normal text-base md:text-md text-neutral-white hover:text-neutral-200"
            aria-label={
              isTabletOrLarger
                ? tConcierge('emailAriaLabel')
                : tConcierge('phoneAriaLabel')
            }
          >
            {t('ctaLink')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
