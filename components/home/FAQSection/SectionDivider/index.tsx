import { useTranslations } from 'next-intl'

import { ContentfulImage } from '@/components/common/ContentfulImage'

const SectionDivider = () => {
  const t = useTranslations('Home.FAQ')

  return (
    <div className="flex items-center justify-center w-full gap-4 md:gap-6">
      <div className="flex-1 h-px bg-secondary-300" />
      <ContentfulImage
        src="/icons/faqs-divider.svg"
        alt={t('decorativeDividerAlt')}
        width={43}
        height={47}
        className="w-8 h-9 md:w-10 md:h-11"
      />
      <div className="flex-1 h-px bg-secondary-300" />
    </div>
  )
}

export { SectionDivider }
