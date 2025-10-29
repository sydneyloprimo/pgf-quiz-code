import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

type ProductsLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>

export default function ProductsLayout({
  children,
  params,
}: ProductsLayoutProps) {
  return (
    <LocaleWrapper localeGroup={['Common', 'Search']} params={params}>
      <div className="min-h-screen min-w-full text-black">{children}</div>
    </LocaleWrapper>
  )
}
