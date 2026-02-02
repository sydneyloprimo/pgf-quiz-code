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
      localeGroup={['Quiz', 'PromiseOfCareAlert', 'Common', 'Detail', 'Cart']}
    >
      {children}
    </LocaleWrapper>
  )
}
