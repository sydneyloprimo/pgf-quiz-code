import { useTranslations } from 'next-intl'

import { FeatureGrid } from '@/components/common/FeatureGrid'
import {
  FeatureClinicIcon,
  FeatureCommunityIcon,
  FeatureEnvironmentIcon,
  FeaturePharmIcon,
  FeatureTransparentIcon,
} from '@/components/common/Icon'

const HomeFeatureGrid = () => {
  const t = useTranslations('Home.Features')

  const features = [
    {
      icon: <FeatureClinicIcon className="size-16" />,
      title: t('feature1Title'),
      description: t('feature1Description'),
    },
    {
      icon: <FeaturePharmIcon className="size-16" />,
      title: t('feature2Title'),
      description: t('feature2Description'),
    },
    {
      icon: <FeatureTransparentIcon className="size-16" />,
      title: t('feature3Title'),
      description: t('feature3Description'),
    },
    {
      icon: <FeatureCommunityIcon className="size-16" />,
      title: t('feature4Title'),
      description: t('feature4Description'),
    },
    {
      type: 'special' as const,
    },
    {
      icon: <FeatureEnvironmentIcon className="size-16" />,
      title: t('feature5Title'),
      description: t('feature5Description'),
    },
  ]

  return (
    <FeatureGrid
      features={features}
      columns={3}
      className="px-5 md:px-24 pt-28 md:pt-32 pb-14 md:pb-16"
    />
  )
}

export { HomeFeatureGrid as FeatureGrid }
