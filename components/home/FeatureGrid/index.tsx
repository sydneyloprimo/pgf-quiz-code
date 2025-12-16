import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

import {
  FeatureClinicIcon,
  FeatureCommunityIcon,
  FeatureEnvironmentIcon,
  FeaturePharmIcon,
  FeatureTransparentIcon,
} from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface FeatureBoxProps {
  icon: ReactNode
  title: string
  description: string
  isEven: boolean
}

const FeatureBox = ({ icon, title, description, isEven }: FeatureBoxProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center',
      'px-6 py-5 gap-8',
      'aspect-square md:aspect-auto md:min-h-80',
      isEven ? 'bg-neutral-400' : 'bg-neutral-300 border border-neutral-500'
    )}
  >
    <div className="size-16 text-tertiary-800">{icon}</div>
    <div className="flex flex-col gap-4 text-center">
      <h3
        className={cn(
          'font-display font-bold',
          'text-xl md:text-2xl',
          'leading-8',
          'text-secondary-950'
        )}
      >
        {title}
      </h3>
      <p className={cn('font-sans text-base leading-6', 'text-secondary-900')}>
        {description}
      </p>
    </div>
  </div>
)

interface FeatureBoxSpecialProps {
  isEven: boolean
}

const FeatureBoxSpecial = ({ isEven }: FeatureBoxSpecialProps) => (
  <div
    className={cn(
      'flex items-center justify-center',
      'px-6 py-5',
      'aspect-square md:aspect-auto md:min-h-80',
      isEven ? 'bg-neutral-400' : 'bg-neutral-300 border border-neutral-500'
    )}
  >
    <div className="relative w-72 h-72">
      <Image
        src="/images/home/dog-standing.png"
        alt=""
        fill
        className="object-contain opacity-90"
        aria-hidden="true"
      />
    </div>
  </div>
)

const FeatureGrid = () => {
  const t = useTranslations('Home.Features')

  const features = [
    {
      icon: <FeatureClinicIcon className="size-16" />,
      title: t('clinicalTitle'),
      description: t('clinicalDescription'),
    },
    {
      icon: <FeaturePharmIcon className="size-16" />,
      title: t('pharmTitle'),
      description: t('pharmDescription'),
    },
    {
      icon: <FeatureTransparentIcon className="size-16" />,
      title: t('transparentTitle'),
      description: t('transparentDescription'),
    },
    {
      icon: <FeatureCommunityIcon className="size-16" />,
      title: t('communityTitle'),
      description: t('communityDescription'),
    },
    {
      type: 'special' as const,
    },
    {
      icon: <FeatureEnvironmentIcon className="size-16" />,
      title: t('environmentTitle'),
      description: t('environmentDescription'),
    },
  ]

  return (
    <section
      className={cn('w-full', 'px-5 md:px-24', 'pt-28 md:pt-32 pb-14 md:pb-16')}
    >
      <div className={cn('grid grid-cols-1 md:grid-cols-3', 'w-full')}>
        {features.map((feature, index) => {
          const isEven = index % 2 === 1

          if ('type' in feature && feature.type === 'special') {
            return <FeatureBoxSpecial key={index} isEven={isEven} />
          }

          return (
            <FeatureBox
              key={index}
              icon={feature.icon}
              title={feature.title!}
              description={feature.description!}
              isEven={isEven}
            />
          )
        })}
      </div>
    </section>
  )
}

export { FeatureGrid }
