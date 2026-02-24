import { useTranslations } from 'next-intl'

import { FeatureGrid } from '@/components/common/FeatureGrid'
import {
  SustainabilityIcon,
  ScienceProof2Icon,
  ScienceProofIcon,
  ResearchDocumentIcon,
  SmallDogIcon,
} from '@/components/common/Icon'

const HomeFeatureGrid = () => {
  const t = useTranslations('Home.Features')

  const features = [
    {
      icon: <ScienceProofIcon className="size-16 text-secondary-950" />,
      title: t('feature1Title'),
      description: t('feature1Description'),
    },
    {
      icon: <ResearchDocumentIcon className="size-16 text-secondary-950" />,
      title: t('feature2Title'),
      description: t('feature2Description'),
    },
    {
      icon: <ScienceProof2Icon className="size-16 text-secondary-950" />,
      title: t('feature3Title'),
      description: t('feature3Description'),
    },
    {
      icon: <SmallDogIcon className="size-16 text-secondary-950" />,
      title: t('feature4Title'),
      description: t('feature4Description'),
    },
    {
      type: 'special' as const,
    },
    {
      icon: <SustainabilityIcon className="size-16 text-secondary-950" />,
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
