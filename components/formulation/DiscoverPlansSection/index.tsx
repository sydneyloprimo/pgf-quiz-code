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
        'py-16',
        'lg:py-20',
        'px-5',
        'lg:px-24',
        'flex flex-col items-center justify-center'
      )}
    >
      <div
        className={cn(
          'flex',
          'max-w-screen-2xl',
          'flex-col',
          'justify-center',
          'items-center',
          'gap-16',
          'self-stretch',
          'w-full'
        )}
      >
        <div
          className={cn(
            'relative',
            'flex flex-col',
            'items-start justify-end',
            'h-80',
            'lg:h-auto',
            'w-full'
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

          {/* Gradient Overlay */}
          <div
            className={cn(
              'absolute inset-0 pointer-events-none',
              'bg-gradient-to-r from-[rgba(0,0,0,0.9)] to-transparent',
              'lg:bg-gradient-to-l lg:from-transparent lg:to-[rgba(0,0,0,0.9)]',
              'z-[1]'
            )}
            aria-hidden="true"
          />

          {/* Content Card */}
          <div
            className={cn(
              'relative z-10',
              'flex flex-col',
              'items-start justify-end',
              'lg:justify-center',
              'gap-4',
              'lg:gap-8',
              'w-full',
              'lg:w-[600px]',
              'max-w-2xl',
              'p-5',
              'lg:p-16'
            )}
          >
            <div
              className={cn(
                'flex flex-col items-center',
                'text-neutral-white',
                'w-full',
                'lg:w-96'
              )}
            >
              <h2
                className={cn(
                  'font-display',
                  'text-xl',
                  'leading-7',
                  'lg:text-5xl',
                  'lg:leading-[1.167]',
                  'tracking-[-0.48px]',
                  'w-full'
                )}
              >
                {t('title')}
              </h2>
              <p
                className={cn('font-sans', 'text-base', 'leading-6', 'w-full')}
              >
                {t('description')}
              </p>
            </div>

            <Button
              variant="primary"
              href={Routes.quiz}
              className="w-full lg:w-auto"
            >
              {t('ctaButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { DiscoverPlansSection }
