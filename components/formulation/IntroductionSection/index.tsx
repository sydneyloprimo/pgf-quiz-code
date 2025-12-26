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
        'py-16 md:py-24',
        'bg-neutral-100',
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
          width={200}
          height={200}
          className="absolute w-48 h-48 opacity-30"
          style={{ right: '5%', top: '10%' }}
        />
      </div>

      {/* Two column text content */}
      <div
        className={cn(
          'relative z-10',
          'grid grid-cols-1 md:grid-cols-2',
          'gap-8 md:gap-16',
          'max-w-6xl mx-auto'
        )}
      >
        <p
          className={cn(
            'font-display font-normal',
            'text-lg md:text-xl',
            'leading-relaxed',
            'text-secondary-900'
          )}
        >
          {t('column1')}
        </p>
        <p
          className={cn(
            'font-display font-normal',
            'text-lg md:text-xl',
            'leading-relaxed',
            'text-secondary-900'
          )}
        >
          {t('column2')}
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center w-full mt-16">
        <Image
          src="/images/formulation/divider.svg"
          alt=""
          width={199}
          height={2}
          className="w-full max-w-md"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

export { IntroductionSection }
