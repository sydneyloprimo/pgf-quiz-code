import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'

interface LoginHeroProps {
  translationNamespace?: string
}

const LoginHero = ({ translationNamespace = 'SignIn' }: LoginHeroProps) => {
  const t = useTranslations(translationNamespace)

  return (
    <div className="hidden lg:flex flex-1 flex-col items-center justify-center max-w-xl min-w-[335px] px-9 py-24 gap-12 bg-quaternary-800 relative z-2">
      <div className="flex flex-col items-center gap-12 w-full">
        <div className="flex justify-center">
          <ContentfulImage
            src="/images/login-logo-full.svg"
            alt={t('logoAlt')}
            width={156}
            height={136}
            priority
            className="filter brightness-0 invert"
          />
        </div>
        <div className="flex flex-col gap-4 items-center max-w-2xl w-full text-center">
          <h1 className="heading-h1 tracking-tight text-neutral-white w-full">
            {t('formSubHeading')}
          </h1>
          <p className="text-body-l text-center text-neutral-white w-full">
            {t('heroDescription')}
          </p>
        </div>
      </div>
    </div>
  )
}

export { LoginHero }
