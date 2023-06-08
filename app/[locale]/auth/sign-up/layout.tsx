import { ReactNode } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default function SignUpLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { locale: Locale }
}) {
  return (
    <LocaleWrapper params={params} localeGroup={['Auth', 'SignUp']}>
      {children}
    </LocaleWrapper>
  )
}
