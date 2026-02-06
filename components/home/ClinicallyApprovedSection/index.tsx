import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import { Routes } from '@/types/enums/routes'

interface StatItemProps {
  percentage: string
  description: string
}

const StatItem = ({ percentage, description }: StatItemProps) => (
  <div className="flex items-center gap-6">
    <span className="font-display text-4xl md:text-5xl leading-tight md:leading-14 tracking-tight text-quaternary-800 shrink-0">
      {percentage}
    </span>
    <p className="text-base leading-6 text-secondary-950">{description}</p>
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
    <section className="w-full px-5 md:px-11 pt-4 pb-0 md:py-32 relative overflow-hidden bg-[url(/images/home/clinically-approved-bg.svg)] bg-no-repeat bg-right bg-size-[auto_100%]">
      <div className="w-full flex flex-col lg:flex-row items-center">
        {/* Image */}
        <div className="w-full lg:w-5/12 relative aspect-square lg:aspect-auto lg:h-[750px] shrink-0">
          <ContentfulImage
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
        <div className="w-full lg:flex-1 flex flex-col gap-14 md:gap-16 py-16 lg:px-35">
          <div className="flex flex-col gap-10">
            <h2 className="font-display text-3xl md:text-4xl leading-tight md:leading-12 text-secondary-950">
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

          <Button
            variant="tertiary"
            href={Routes.formulation}
            className="w-full md:w-3/5"
          >
            {t('ctaButton')}
          </Button>
        </div>

        {/* Decoration - Desktop/Tablet: bottom right */}
        <div className="block self-end md:absolute bottom-0 md:bottom-8 right-2 md:right-8 lg:bottom-12 lg:right-12">
          <ContentfulImage
            src="/icons/clinically-approved-decoration.svg"
            alt=""
            width={250}
            height={250}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}

export { ClinicallyApprovedSection }
