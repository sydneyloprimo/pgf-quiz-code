import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import { Routes } from '@/types/enums/routes'

const CTASection = () => {
  const t = useTranslations('About.CTA')

  return (
    <section className="w-full flex flex-col items-center justify-center px-5 md:px-24 py-20 relative bg-quaternary-800 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-quaternary-800" />
        <div className="absolute inset-0 mix-blend-overlay opacity-50 overflow-hidden">
          <ContentfulImage
            src="/images/about/cta-bg.jpg"
            alt=""
            fill
            className="object-cover scale-150"
            sizes="100vw"
          />
        </div>
      </div>
      <div className="relative z-10 flex flex-col gap-5 items-center w-full">
        <div className="flex flex-col gap-6 items-center px-12 py-0 w-full">
          <p className="font-display font-normal text-3xl leading-10 tracking-tight text-neutral-white text-center w-full">
            {t('quote')}
          </p>
          <p className="font-sans text-lg leading-normal text-neutral-white text-center w-full max-w-2xl">
            {t('body')}
          </p>
        </div>
        <Button
          variant="tertiary"
          size="medium"
          href={Routes.formulation}
          className="max-w-sm"
        >
          {t('button')}
        </Button>
      </div>
    </section>
  )
}

export { CTASection }
