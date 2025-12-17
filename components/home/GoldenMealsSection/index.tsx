import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'

const GoldenMealsSection = () => {
  const t = useTranslations('Home.GoldenMeals')

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-11 py-12',
        'flex flex-col items-center justify-center'
      )}
    >
      <div
        className={cn(
          'w-full',
          'relative',
          'min-h-[500px] md:min-h-[651px]',
          'flex items-end justify-end',
          'overflow-hidden'
        )}
      >
        {/* Background Image */}
        <Image
          src="/images/home/golden-meals-bg.jpg"
          alt={t('imageAlt')}
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-tertiary-800-70 mix-blend-color"
          aria-hidden="true"
        />

        {/* Content Card */}
        <div
          className={cn(
            'relative z-10',
            'w-full md:w-auto md:max-w-md',
            'px-6 md:px-10 py-12',
            'flex flex-col gap-8 items-start',
            'm-5 md:m-0'
          )}
        >
          <div className={cn('flex flex-col gap-3', 'text-neutral-white')}>
            <h2
              className={cn(
                'font-display',
                'text-3xl md:text-4xl',
                'leading-tight md:leading-12',
                'tracking-tight'
              )}
            >
              {t('title')}
            </h2>
            <p className="font-sans text-lg leading-7">{t('description')}</p>
          </div>

          <Button variant="secondary" href="/recipe">
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { GoldenMealsSection }
