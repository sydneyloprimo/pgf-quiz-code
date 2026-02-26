import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { NOT_FOUND_DOG_BOWL_IMAGE } from '@/constants'
import { Routes } from '@/types/enums/routes'

const NotFoundContent = () => {
  const t = useTranslations('NotFound')

  return (
    <section className="flex flex-1 items-center justify-center bg-neutral-400 border-b border-neutral-800 w-full">
      <div className="flex flex-col items-center gap-3 w-full max-w-lg py-32">
        <Image
          src={NOT_FOUND_DOG_BOWL_IMAGE}
          alt={t('dogBowlAlt')}
          width={100}
          height={100}
          className="w-24 md:w-36 h-auto"
          priority
          unoptimized
        />
        <div className="flex flex-col items-center gap-6 w-full text-center">
          <div className="flex flex-col items-center gap-3 w-full">
            <h1 className="heading-h2 md:heading-h1 font-semibold md:leading-14 md:tracking-[-0.48px] text-center text-secondary-950">
              {t('title')}
            </h1>
            <p className="text-body-m text-center text-secondary-900">
              {t('subtitle')}
            </p>
          </div>
          <Button href={Routes.home} variant="primary" size="medium">
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { NotFoundContent }
