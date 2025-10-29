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
      <div className="h-screen w-full bg-auth_bg_image bg-no-repeat bg-cover flex justify-center md:block">
        {children}
      </div>
    </LocaleWrapper>
  )
}
