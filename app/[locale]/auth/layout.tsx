import { setRequestLocale } from 'next-intl/server'
import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default async function AuthLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <LocaleWrapper params={params} localeGroup={['Auth', 'SignIn', 'SignUp']}>
      <div className="w-full flex justify-center">{children}</div>
    </LocaleWrapper>
  )
}
