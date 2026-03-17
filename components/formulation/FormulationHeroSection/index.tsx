'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import { QUIZ_RETURN_PATH_KEY } from '@/constants'
import { Routes } from '@/types/enums/routes'
import { safeSessionStorage } from '@/utils/safeSessionStorage'

const FormulationHeroSection = () => {
  const t = useTranslations('Formulation.Hero')

  return (
    <section className="relative w-full h-96 md:h-120 flex items-center">
      {/* Background Image */}
      <ContentfulImage
        src="/images/formulation/hero-bg.png"
        alt={t('backgroundAlt')}
        fillVariant="native"
        className="object-cover object-[center_25%]"
        priority
      />

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
          href={Routes.quiz}
          className="w-fit"
          onClick={() => {
            safeSessionStorage.setItem(QUIZ_RETURN_PATH_KEY, Routes.formulation)
          }}
        >
          {t('ctaButton')}
        </Button>
      </div>
    </section>
  )
}

export { FormulationHeroSection }
