'use client'

import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import { QUIZ_RETURN_PATH_KEY } from '@/constants'
import { useVideoAutoPlay } from '@/hooks/useVideoAutoPlay'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'
import { safeSessionStorage } from '@/utils/safeSessionStorage'

const HeroSection = () => {
  const t = useTranslations('Home.Hero')
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useVideoAutoPlay(videoRef)

  return (
    <section className="relative w-full h-150 md:min-h-96 lg:min-h-160 flex items-end justify-center md:justify-start overflow-hidden">
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
        className="absolute inset-0 bg-neutral-950 opacity-30 z-2"
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10',
          'flex flex-col gap-2 md:gap-6',
          'items-center md:items-start',
          'text-center md:text-left',
          'px-5 md:px-11 py-6 md:py-12',
          'md:px-12',
          'desktop:px-32',
          'max-w-2xl'
        )}
      >
        <h1
          className={cn(
            'font-display',
            'text-3xl md:text-5xl desktop:text-6xl',
            'leading-tight',
            'tracking-tight',
            'text-neutral-white',
            'w-full'
          )}
        >
          {t('headline')}
        </h1>

        <p className="text-lg text-neutral-white opacity-90 w-full">
          {t('subheadline')}
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Button
            variant="primary"
            href={Routes.quiz}
            className="w-full md:w-auto px-4 py-4"
            onClick={() => {
              safeSessionStorage.setItem(QUIZ_RETURN_PATH_KEY, Routes.home)
            }}
          >
            {t('ctaButton')}
          </Button>

          <Link
            href={Routes.recipes}
            size="large"
            className="font-normal text-base md:text-md text-neutral-white hover:text-neutral-200"
          >
            {t('ctaLink')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
