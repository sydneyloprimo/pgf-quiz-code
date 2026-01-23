import { useTranslations } from 'next-intl'

import { PageHero } from '@/components/common/PageHero'

export default function TermsAndConditionsPage() {
  const t = useTranslations('TermsAndConditions')

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <PageHero translationKey="TermsAndConditions.Hero" />
      <section className="flex flex-col gap-6 w-full max-w-3xl px-5 py-16 md:py-24">
        <p className="font-sans text-base leading-6 text-secondary-900 text-center">
          {t('paragraph1')}
        </p>
        <p className="font-sans text-base leading-6 text-secondary-900 text-center">
          {t('paragraph2')}
        </p>
        <p className="font-sans text-base leading-6 text-secondary-900 text-center">
          {t('paragraph3')}
        </p>
        <p className="font-sans text-base leading-6 text-secondary-900 text-center">
          {t('paragraph4')}
        </p>
      </section>
    </main>
  )
}
