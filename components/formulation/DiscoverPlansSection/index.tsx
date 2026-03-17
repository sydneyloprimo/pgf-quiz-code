'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import {
  FORMULATION_SECTION_PADDING_X,
  FORMULATION_SECTION_PADDING_Y,
  QUIZ_RETURN_PATH_KEY,
} from '@/constants'
import { CtaLocation, CtaName } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'
import { trackCtaClick } from '@/utils/analytics'
import { cn } from '@/utils/cn'
import { safeSessionStorage } from '@/utils/safeSessionStorage'

const DiscoverPlansSection = () => {
  const t = useTranslations('Formulation.DiscoverPlans')

  const handleStartQuiz = useCallback(() => {
    trackCtaClick(CtaName.startQuiz, CtaLocation.formulationDiscoverPlans)
    safeSessionStorage.setItem(QUIZ_RETURN_PATH_KEY, Routes.formulation)
  }, [])

  return (
    <section
      className={cn(
        'w-full flex flex-col items-center justify-center',
        FORMULATION_SECTION_PADDING_X,
        FORMULATION_SECTION_PADDING_Y
      )}
    >
      <div className="flex max-w-screen-2xl flex-col justify-center items-center gap-16 self-stretch w-full">
        <div className="relative flex flex-col items-start justify-end lg:justify-around h-80 lg:h-[500px] w-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <ContentfulImage
              src="/images/formulation/discover-plans-bg-new.jpg"
              alt={t('backgroundAlt')}
              fill
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-[rgba(68,52,36,0.41)] mix-blend-color"
              aria-hidden="true"
            />
          </div>

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[rgba(0,0,0,0.9)] to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[rgba(0,0,0,0.9)] z-[1]"
            aria-hidden="true"
          />

          {/* Content Card */}
          <div className="relative z-10 flex flex-col items-start justify-end lg:justify-center gap-4 lg:gap-8 w-full lg:w-[600px] max-w-2xl p-5 lg:p-16">
            <div className="flex flex-col items-center text-neutral-white w-full lg:w-96">
              <h2 className="font-display text-xl leading-7 lg:text-5xl lg:leading-[1.167] tracking-[-0.48px] w-full">
                {t('title')}
              </h2>
              <p className="font-sans text-base pt-4 leading-6 w-full">
                {t('description')}
              </p>
            </div>

            <Button
              variant="primary"
              href={Routes.quiz}
              className="w-full lg:w-auto"
              onClick={handleStartQuiz}
            >
              {t('ctaButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { DiscoverPlansSection }
