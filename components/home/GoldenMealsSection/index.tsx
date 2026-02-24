import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import { Routes } from '@/types/enums/routes'
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
          'aspect-[3/4] md:aspect-auto md:min-h-164',
          'flex items-start md:items-end justify-end',
          'overflow-hidden'
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <ContentfulImage
            src="/images/home/golden-meals-bg.jpg"
            alt={t('imageAlt')}
            fill
            className="object-cover md:object-center"
          />
        </div>
        {/* Black overlay for text contrast (ADA) */}
        <div
          className="absolute inset-0 bg-neutral-950/50"
          aria-hidden="true"
        />
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
          )}
        >
          <div className="flex flex-col gap-3 text-neutral-white">
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

          <Button variant="secondary" href={Routes.formulation}>
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { GoldenMealsSection }
