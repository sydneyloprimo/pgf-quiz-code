'use client'

import { useTranslations } from 'next-intl'

import { MAIN_CONTENT_ID } from '@/constants'

const SkipLink = () => {
  const t = useTranslations('Accessibility')

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-neutral-white focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-primary-600 focus:text-primary-800 focus:font-bold focus:shadow-lg"
    >
      {t('skipToMainContent')}
    </a>
  )
}

export { SkipLink }
