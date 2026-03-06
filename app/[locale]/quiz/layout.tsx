import { setRequestLocale } from 'next-intl/server'
import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default async function QuizLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <LocaleWrapper
      params={params}
      localeGroup={[
        'Cart',
        'Common',
        'ContactInfo',
        'Detail',
        'FeatureFlags',
        'PromiseOfCareAlert',
        'Quiz',
      ]}
    >
      {children}
    </LocaleWrapper>
  )
}
