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
          'min-h-[650px] md:min-h-[651px]',
          'flex items-start md:items-end justify-end',
          'overflow-hidden'
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0 translate-y-15 md:translate-y-0">
          <Image
            src="/images/home/golden-meals-bg.png"
            alt={t('imageAlt')}
            fill
            className={cn('object-cover scale-140 md:scale-100')}
          />
        </div>
        <div
          className="absolute inset-0 mix-blend-color"
          style={{
            background:
              'linear-gradient(0deg, rgba(68, 52, 36, 0.15) 0%, rgba(68, 52, 36, 0.15) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Content Card */}
        <div
          className={cn(
            'relative z-10',
            'w-full md:w-auto md:max-w-md',
            'px-8 md:px-10 py-12',
            'flex flex-col gap-8 items-start'
            // 'm-5 mb-24 md:m-0'
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
