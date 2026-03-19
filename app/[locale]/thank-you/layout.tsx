import { setRequestLocale } from 'next-intl/server'
import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default async function ThankYouLayout({
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
      localeGroup={['ContactInfo', 'Quiz', 'ThankYou']}
    >
      {children}
    </LocaleWrapper>
  )
}
