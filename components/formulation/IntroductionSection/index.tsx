import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

const IntroductionSection = () => {
  const t = useTranslations('Formulation.Introduction')

  return (
    <section
      className={cn(
        'relative w-full',
        'px-5 md:px-24 desktop:px-32',
        'py-16 md:py-[100px]',
        'bg-neutral-400',
        'overflow-hidden'
      )}
    >
      {/* Decorative background elements */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <Image
          src="/images/formulation/decorative-group.svg"
          alt=""
          width={584}
          height={824}
          className="absolute opacity-30"
          style={{ right: '-25%', top: '0%' }}
        />
      </div>

      {/* Two column text content */}
      <div
        className={cn(
          'relative z-10',
          'grid grid-cols-1 md:grid-cols-2',
          'gap-8 md:gap-16',
          'max-w-6xl mx-auto',
          'py-12'
        )}
      >
        <p
          className={cn(
            'font-sans font-normal',
            'text-sm md:text-lg',
            'leading-normal',
            'text-secondary-950'
          )}
        >
          {t('column1')}
        </p>
        <p
          className={cn(
            'font-sans font-normal',
            'text-sm md:text-lg',
            'leading-normal',
            'text-secondary-950'
          )}
        >
          {t('column2')}
        </p>
      </div>
    </section>
  )
}

export { IntroductionSection }
