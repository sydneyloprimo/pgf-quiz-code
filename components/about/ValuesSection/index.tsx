import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { ReactElement } from 'react'

import { ValueCard } from '@/components/about/ValuesSection/ValueCard'
import {
  FeaturePharmIcon,
  GraduationCapIcon,
  PawPrintIcon,
} from '@/components/common/Icon'
import { VALUE_ITEMS, type ValueIconType } from '@/constants'
import { cn } from '@/utils/cn'

const getValueIcon = (iconType: ValueIconType): ReactElement => {
  const iconProps = { className: 'size-11' }
  switch (iconType) {
    case 'featurePharm':
      return <FeaturePharmIcon {...iconProps} />
    case 'graduationCap':
      return <GraduationCapIcon {...iconProps} />
    case 'pawPrint':
      return <PawPrintIcon {...iconProps} />
  }
}

const ValuesSection = () => {
  const t = useTranslations('About.Values')

  const values = VALUE_ITEMS.map((item) => ({
    icon: getValueIcon(item.iconType),
    title: t(item.titleKey),
    description: t(item.descriptionKey),
  }))

  return (
    <section
      className={cn(
        'w-full',
        'px-5 md:px-24 py-9 md:py-9',
        'bg-quaternary-800',
        'relative overflow-hidden'
      )}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/images/about/values-background-texture.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>
      <div
        className={cn(
          'flex flex-col md:flex-row',
          'gap-0 md:gap-0',
          'w-full',
          'relative z-10'
        )}
      >
        {values.map((value, index) => (
          <ValueCard
            key={index}
            icon={value.icon}
            title={value.title}
            description={value.description}
          />
        ))}
      </div>
    </section>
  )
}

export { ValuesSection }
