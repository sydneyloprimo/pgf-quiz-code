import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default function AuthLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>) {
  return (
    <LocaleWrapper params={params} localeGroup={['Auth', 'SignIn', 'SignUp']}>
      <div className="w-full flex justify-center">{children}</div>
    </LocaleWrapper>
  )
}
