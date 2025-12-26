import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

interface FeatureBoxProps {
  iconSrc: string
  title: string
}

const FeatureBox = ({ iconSrc, title }: FeatureBoxProps) => (
  <div
    className={cn(
      'bg-neutral-100',
      'flex flex-col items-center justify-center',
      'gap-8 md:gap-12',
      'px-6 md:px-11 py-6',
      'min-h-48 md:min-h-56'
    )}
  >
    <Image
      src={iconSrc}
      alt=""
      width={48}
      height={48}
      className="w-10 h-10 md:w-12 md:h-12"
      aria-hidden="true"
    />
    <h3
      className={cn(
        'font-display',
        'text-lg md:text-2xl',
        'leading-tight md:leading-8',
        'text-center',
        'text-quaternary-800'
      )}
    >
      {title}
    </h3>
  </div>
)

const OurStandardsSection = () => {
  const t = useTranslations('Formulation.Standards')

  const features = [
    {
      iconSrc: '/images/formulation/icon-cauliflower.svg',
      title: t('clinicallyBacked'),
    },
    {
      iconSrc: '/images/formulation/icon-carrot.svg',
      title: t('humanGrade'),
    },
    {
      iconSrc: '/images/formulation/icon-leaf.svg',
      title: t('noAdditives'),
    },
    {
      iconSrc: '/images/formulation/icon-garlic2.svg',
      title: t('measuredPortions'),
    },
  ]

  return (
    <section className={cn('w-full', 'px-5 md:px-24 desktop:px-32', 'py-8')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <FeatureBox
            key={index}
            iconSrc={feature.iconSrc}
            title={feature.title}
          />
        ))}
      </div>
    </section>
  )
}

export { OurStandardsSection }
