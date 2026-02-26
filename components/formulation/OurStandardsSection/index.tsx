import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'
import { FeatureGrid } from '@/components/common/FeatureGrid'
import {
  FORMULATION_SECTION_PADDING_X,
  FORMULATION_SECTION_PADDING_Y,
} from '@/constants'
import { cn } from '@/utils/cn'

const OurStandardsSection = () => {
  const t = useTranslations('Formulation.Standards')

  const titleClassName = 'font-normal text-2xl text-quaternary-800'

  const features = [
    {
      icon: (
        <div className="h-12 w-auto">
          <ContentfulImage
            src="/images/formulation/board.svg"
            alt=""
            width={40}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('box1Title'),
      titleClassName,
      orderClassName: 'order-1',
      description: t('box1Description'),
    },
    {
      icon: (
        <div className="h-12 w-auto">
          <ContentfulImage
            src="/images/formulation/list.svg"
            alt=""
            width={43}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('box2Title'),
      titleClassName,
      orderClassName: 'order-2',
      description: t('box2Description'),
    },
    {
      icon: (
        <div className="h-12 w-auto">
          <ContentfulImage
            src="/images/formulation/certified.svg"
            alt=""
            width={49}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('box3Title'),
      titleClassName,
      orderClassName: 'order-4 md:order-3',
      description: t('box3Description'),
    },
    {
      icon: (
        <div className="h-12 w-auto">
          <ContentfulImage
            src="/images/formulation/validated.svg"
            alt=""
            width={38}
            height={48}
            className="h-full w-auto object-contain"
            aria-hidden="true"
          />
        </div>
      ),
      title: t('box4Title'),
      titleClassName,
      orderClassName: 'order-3 md:order-4',
      description: t('box4Description'),
    },
  ]

  return (
    <section
      className={cn(
        'w-full',
        FORMULATION_SECTION_PADDING_X,
        FORMULATION_SECTION_PADDING_Y
      )}
    >
      <h2 className="heading-h2 text-secondary-950 text-center tracking-[-0.4px] mb-8">
        {t('title')}
      </h2>
      <p className="font-sans text-lg text-quaternary-800 text-center mb-12">
        {t('subtitle')}
      </p>
      <FeatureGrid features={features} columns={2} />
    </section>
  )
}

export { OurStandardsSection }
