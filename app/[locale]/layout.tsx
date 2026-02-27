import './globals.css'

import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PropsWithChildren } from 'react'
import Providers from 'utils/Providers'
import Session from 'utils/Session'

import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from '@/components/common/JsonLd'
import { Locale } from '@/i18n'
import BodyScripts from '@/scripts/BodyScripts'
import HeadScripts from '@/scripts/HeadScripts'

export const metadata: Metadata = {
  title: {
    default: 'Purely Golden Foods',
    template: '%s | Purely Golden Foods',
  },
  description:
    'Veterinarian-formulated fresh dog food for small breeds. Clinically backed, human-grade recipes with real ingredients. Build your custom meal plan today.',
  keywords: [
    'fresh dog food',
    'small breed dog food',
    'veterinarian formulated dog food',
    'human grade dog food',
    'custom dog meal plan',
    'healthy dog food',
    'Purely Golden Foods',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Purely Golden Foods',
    description:
      'Veterinarian-formulated fresh dog food for small breeds. Clinically backed, human-grade recipes with real ingredients.',
    title: 'Purely Golden Foods',
  },
  robots: {
    index: true,
    follow: true,
  },
}

type RootLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params
  const t = await getTranslations('ContactInfo')
  const conciergeEmail = t('conciergeEmail')?.trim() || undefined

  return (
    <html className="bg-dark-violet" lang={locale}>
      <head>
        <HeadScripts />
        <JsonLd data={organizationSchema({ email: conciergeEmail })} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body className="flex items-center flex-col">
        <BodyScripts />
        <Providers params={params}>
          <Session>{children}</Session>
        </Providers>
      </body>
    </html>
  )
}
