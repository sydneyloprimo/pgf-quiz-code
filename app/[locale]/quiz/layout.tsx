import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default function QuizLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>) {
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
