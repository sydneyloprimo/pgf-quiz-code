import { useTranslations } from 'next-intl'

import { ValueCard } from '@/components/about/ValuesSection/ValueCard'
import { Button } from '@/components/common/Button'
import { ContentfulImage } from '@/components/common/ContentfulImage'
import { VALUE_ITEMS } from '@/constants'
import { Routes } from '@/types/enums/routes'

const ValuesSection = () => {
  const t = useTranslations('About.Values')

  const values = VALUE_ITEMS.map((item) => ({
    title: t(item.titleKey),
    description: t(item.descriptionKey),
  }))

  return (
    <section className="w-full px-5 md:px-24 py-9 md:py-9 bg-quaternary-800 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <ContentfulImage
          src="/images/about/values-background-texture.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-0 md:gap-0 w-full relative z-10">
        {values.map((value) => (
          <ValueCard
            key={value.title}
            title={value.title}
            description={value.description}
          />
        ))}
      </div>
      <div className="relative z-10 flex justify-center pt-6 pb-10 md:pt-10 md:pb-12">
        <Button variant="tertiary" href={Routes.formulation}>
          {t('ctaButton')}
        </Button>
      </div>
    </section>
  )
}

export { ValuesSection }
