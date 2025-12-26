import { useTranslations } from 'next-intl'

import { FeatureGrid } from '@/components/common/FeatureGrid'
import {
  FeatureClinicIcon,
  FeatureCommunityIcon,
  FeatureEnvironmentIcon,
  FeaturePharmIcon,
  FeatureTransparentIcon,
} from '@/components/common/Icon'
import { cn } from '@/utils/cn'

const HomeFeatureGrid = () => {
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
    <FeatureGrid
      features={features}
      columns={3}
      className={cn('px-5 md:px-24', 'pt-28 md:pt-32 pb-14 md:pb-16')}
    />
  )
}

export { HomeFeatureGrid as FeatureGrid }
