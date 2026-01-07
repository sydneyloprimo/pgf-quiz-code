import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { FeatureGrid } from '@/components/common/FeatureGrid'

const OurStandardsSection = () => {
  const t = useTranslations('Formulation.Standards')

  const titleClassName = 'font-normal text-2xl text-quaternary-800'

  const features = [
    {
      icon: (
        <div className="h-12 w-auto">
          <Image
            src="/images/formulation/icon-cauliflower.svg"
            alt=""
            width={40}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('clinicallyBacked'),
      titleClassName,
      orderClassName: 'order-1 md:order-1',
    },
    {
      icon: (
        <div className="h-12 w-auto">
          <Image
            src="/images/formulation/icon-carrot.svg"
            alt=""
            width={43}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('humanGrade'),
      titleClassName,
      orderClassName: 'order-2 md:order-2',
    },
    {
      icon: (
        <div className="h-12 w-auto">
          <Image
            src="/images/formulation/icon-leaf.svg"
            alt=""
            width={49}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('noAdditives'),
      titleClassName,
      orderClassName: 'order-4 md:order-3',
    },
    {
      icon: (
        <div className="h-12 w-auto">
          <Image
            src="/images/formulation/icon-garlic2.svg"
            alt=""
            width={38}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('measuredPortions'),
      titleClassName,
      orderClassName: 'order-3 md:order-4',
    },
  ]

  return (
    <FeatureGrid
      features={features}
      columns={2}
      className="px-5 md:px-24 desktop:px-32 py-8"
    />
  )
}

export { OurStandardsSection }
