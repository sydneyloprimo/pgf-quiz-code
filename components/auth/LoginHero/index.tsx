import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const LoginHero = () => {
  const t = useTranslations('SignIn')

  return (
    <div
      className={cn(
        'hidden desktop:flex',
        'flex-1 flex-col items-center justify-center',
        'max-w-[540px] min-w-[335px]',
        'px-9 py-12',
        'gap-12'
      )}
    >
      <div className="flex flex-col items-center gap-12 w-full">
        <div className="flex justify-center">
          <Image
            src="/icons/logo-white.svg"
            alt={t('logoAlt')}
            width={191}
            height={166}
            priority
          />
        </div>
        <div className="flex flex-col gap-4 items-center max-w-[670px] w-full text-center">
          <h1
            className={cn(
              'font-display',
              'text-[48px] leading-[56px] tracking-[-0.48px]',
              'font-semibold',
              'text-neutral-white',
              'w-full'
            )}
          >
            {t('heroHeading')}
          </h1>
          <p
            className={cn(
              'font-body',
              'text-[20px] leading-[32px]',
              'text-neutral-white',
              'w-full'
            )}
          >
            {t('heroDescription')}
          </p>
        </div>
      </div>
    </div>
  )
}

export { LoginHero }
