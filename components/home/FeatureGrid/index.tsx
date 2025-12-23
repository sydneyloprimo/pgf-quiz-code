import { useTranslations } from 'next-intl'

import {
  FeatureClinicIcon,
  FeatureCommunityIcon,
  FeatureEnvironmentIcon,
  FeaturePharmIcon,
  FeatureTransparentIcon,
} from '@/components/common/Icon'
import { FeatureBox } from '@/components/home/FeatureGrid/FeatureBox'
import { FeatureBoxSpecial } from '@/components/home/FeatureGrid/FeatureBoxSpecial'
import { cn } from '@/utils/cn'

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
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
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
