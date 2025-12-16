import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'

interface StatItemProps {
  percentage: string
  description: string
}

const StatItem = ({ percentage, description }: StatItemProps) => (
  <div className="flex items-center gap-6">
    <span
      className={cn(
        'font-display font-semibold',
        'text-4xl md:text-5xl',
        'leading-tight md:leading-14',
        'tracking-tight',
        'text-quaternary-800',
        'shrink-0'
      )}
    >
      {percentage}
    </span>
    <p
      className={cn('font-semibold text-base leading-6', 'text-secondary-950')}
    >
      {description}
    </p>
  </div>
)

const ClinicallyApprovedSection = () => {
  const t = useTranslations('Home.ClinicallyApproved')

  const stats = [
    { percentage: '86%', description: t('stat1') },
    { percentage: '45%', description: t('stat2') },
    { percentage: '75%', description: t('stat3') },
    { percentage: '25%', description: t('stat4') },
  ]

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-11 py-28 md:py-32',
        'relative overflow-hidden'
      )}
    >
      <div
        className={cn(
          'w-full',
          'flex flex-col lg:flex-row',
          'items-center',
          'gap-16 md:gap-36'
        )}
      >
        {/* Image */}
        <div
          className={cn(
            'w-full lg:w-5/12',
            'relative',
            'aspect-square lg:aspect-auto lg:h-[750px]',
            'shrink-0'
          )}
        >
          <Image
            src="/images/home/clinically-approved-dog.jpg"
            alt={t('imageAlt')}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-tertiary-800-70 mix-blend-color"
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div
          className={cn(
            'w-full lg:flex-1',
            'flex flex-col gap-14 md:gap-16',
            'py-0 lg:py-16'
          )}
        >
          <div className="flex flex-col gap-10">
            <h2
              className={cn(
                'font-display font-semibold',
                'text-3xl md:text-4xl',
                'leading-tight md:leading-12',
                'text-secondary-950'
              )}
            >
              {t('title')}
            </h2>

            <div className="flex flex-col gap-6">
              {stats.map((stat, index) => (
                <StatItem
                  key={index}
                  percentage={stat.percentage}
                  description={stat.description}
                />
              ))}
            </div>
          </div>

          <Button variant="tertiary" href="/recipe">
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { ClinicallyApprovedSection }
