import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

type OrdersLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>

export default function OrdersLayout({ children, params }: OrdersLayoutProps) {
  return (
    <LocaleWrapper localeGroup={['Orders', 'Common']} params={params}>
      <div className="min-h-screen min-w-full text-black">{children}</div>
    </LocaleWrapper>
  )
}
