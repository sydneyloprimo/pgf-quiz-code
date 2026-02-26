import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import { ChevronIcon } from '@/components/common/Icon'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface StatItemProps {
  title: string
  description: string
}

const StatItem = ({ title, description }: StatItemProps) => (
  <div className="flex flex-col gap-2 md:gap-3">
    <h3 className="font-display text-xl md:text-2xl md:leading-10 tracking-tight text-quaternary-800">
      {title}
    </h3>
    <p className="text-base leading-6 text-secondary-950">{description}</p>
  </div>
)

const ClinicallyApprovedSection = () => {
  const t = useTranslations('Home.ClinicallyApproved')

  const stats = [
    { title: t('item1Title'), description: t('item1Description') },
    { title: t('item2Title'), description: t('item2Description') },
    { title: t('item3Title'), description: t('item3Description') },
    { title: t('item4Title'), description: t('item4Description') },
    { title: t('item5Title'), description: t('item5Description') },
    { title: t('item6Title'), description: t('item6Description') },
  ]

  return (
    <section className="w-full px-5 md:px-11 pt-4 pb-0 md:py-32 relative overflow-hidden bg-[url(/images/home/clinically-approved-bg.svg)] bg-no-repeat bg-right-top bg-size-[25%]">
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start">
        {/* Image */}
        <div className="w-full lg:w-5/12 relative aspect-[3/4] md:aspect-square lg:aspect-auto lg:h-[750px] shrink-0">
          <ContentfulImage
            src="/images/home/clinically-approved-dog.jpg"
            alt={t('imageAlt')}
            fill
            className="object-cover object-[center_25%]"
          />
        </div>

        {/* Content */}
        <div className="w-full lg:flex-1 flex flex-col gap-14 md:gap-16 py-16 lg:pt-0 lg:pb-0 lg:px-10">
          <div className="flex flex-col gap-10">
            <h2 className="font-display text-3xl md:text-4xl leading-tight md:leading-12 text-secondary-950">
              {t('title')}
            </h2>
            <p className="font-sans text-lg leading-7 text-secondary-950">
              {t('description')}
            </p>
            <div className="flex flex-col gap-6">
              {stats.map((stat, index) => (
                <StatItem
                  key={index}
                  title={stat.title}
                  description={stat.description}
                />
              ))}
            </div>

            <details
              className={cn(
                'text-secondary-950 border-b border-neutral-600',
                '[&[open]_.disclaimer-chevron]:rotate-180'
              )}
            >
              <summary className="cursor-pointer list-none py-3 flex items-center gap-2 font-sans text-base font-medium text-secondary-950 outline-none [&::-webkit-details-marker]:hidden">
                <ChevronIcon
                  direction="down"
                  className="disclaimer-chevron size-5 shrink-0 text-secondary-950 transition-transform"
                  aria-hidden="true"
                />
                <span>{t('disclaimerLabel')}</span>
              </summary>
              <p className="pb-3 pl-7 text-sm leading-6 text-secondary-950">
                {t('disclaimerText')}
              </p>
            </details>
          </div>

          <Button
            variant="tertiary"
            href={Routes.formulation}
            className="w-full md:w-3/5"
          >
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { ClinicallyApprovedSection }
