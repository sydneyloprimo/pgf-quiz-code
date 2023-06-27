import { PropsWithChildren } from 'react'

import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

type ProfileLayoutProps = PropsWithChildren<{ params: { locale: Locale } }>

export default function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  return (
    <LocaleWrapper localeGroup="Profile" params={params}>
      <div className="flex min-h-screen min-w-full flex-col relative bg-background">
        <div className="bg-dark-violet h-[295px] hidden md:inline" />
        <div className="absolute md:mx-[119px] md:top-[32px] top-0 left-0 right-0 m-auto">
          {children}
        </div>
      </div>
    </LocaleWrapper>
  )
}
