import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

interface CartLayoutProps extends PropsWithChildren {
  params: { locale: Locale }
}

export default function CartLayout({ children, params }: CartLayoutProps) {
  return (
    <LocaleWrapper localeGroup="Cart" params={params}>
      <div className="min-h-screen min-w-full">{children}</div>
    </LocaleWrapper>
  )
}
