import { setRequestLocale } from 'next-intl/server'
import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

type ProfileLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <LocaleWrapper localeGroup="Profile" params={params}>
      <div className="flex min-h-screen min-w-full flex-col bg-background">
        <div className="md:mx-28">{children}</div>
      </div>
    </LocaleWrapper>
  )
}
