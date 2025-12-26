import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

const DiscoverPlansSection = () => {
  const t = useTranslations('Formulation.DiscoverPlans')

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-24',
        'py-20',
        'flex flex-col items-center justify-center'
      )}
    >
      <div
        className={cn(
          'relative',
          'w-full',
          'flex flex-col items-start justify-center',
          'p-15'
        )}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <Image
            src="/images/formulation/discover-plans-bg-new.jpg"
            alt={t('backgroundAlt')}
            fill
            className="object-cover object-center"
          />
          <div
            className={cn(
              'absolute inset-0',
              'bg-[rgba(68,52,36,0.41)]',
              'mix-blend-color'
            )}
            aria-hidden="true"
          />
        </div>

        {/* Content Card */}
        <div
          className={cn(
            'relative z-10',
            'backdrop-blur-[6px]',
            'bg-gradient-to-l from-transparent to-[rgba(0,0,0,0.9)]',
            'flex flex-col gap-8',
            'items-start justify-center',
            // 'w-[617px]',
            // 'h-[511px]',
            // 'p-[60px]',
            'shrink-0'
          )}
        >
          <div
            className={cn(
              'flex flex-col items-center',
              'text-neutral-white',
              'w-[392px]'
            )}
          >
            <h2
              className={cn(
                'font-display',
                'text-5xl md:text-6xl',
                'leading-[56px]',
                'tracking-[-0.48px]',
                'w-full'
              )}
            >
              {t('title')}
            </h2>
            <p className={cn('font-sans', 'text-base', 'leading-6', 'w-full')}>
              {t('description')}
            </p>
          </div>

          <Button variant="primary" href={Routes.quiz}>
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { DiscoverPlansSection }
