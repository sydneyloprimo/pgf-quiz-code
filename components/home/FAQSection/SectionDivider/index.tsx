import { useTranslations } from 'next-intl'

import { FaqsDividerIcon } from '@/components/common/Icon'

const SectionDivider = () => {
  const t = useTranslations('Home.FAQ')

  return (
    <div className="flex items-center justify-center w-full gap-4 md:gap-6">
      <div className="flex-1 h-px bg-neutral-600" />
      <FaqsDividerIcon
        className="w-8 h-9 md:w-10 md:h-11 shrink-0 text-faq-divider-icon"
        aria-label={t('decorativeDividerAlt')}
      />
      <div className="flex-1 h-px bg-neutral-600" />
    </div>
  )
}

export { SectionDivider }
