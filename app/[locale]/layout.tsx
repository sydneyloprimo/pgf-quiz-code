import './globals.css'

import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PropsWithChildren } from 'react'
import Providers from 'utils/Providers'
import Session from 'utils/Session'

import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from '@/components/common/JsonLd'
import { GTM_AUTH, GTM_ID, GTM_PREVIEW } from '@/constants'
import { Locale } from '@/i18n'
import BodyScripts from '@/scripts/BodyScripts'
import HeadScripts from '@/scripts/HeadScripts'

export function generateStaticParams() {
  return [{ locale: Locale.EN }]
}

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
  icons: {
    icon: [
      {
        url: '/icons/favicon-16.svg',
        sizes: '16x16',
        type: 'image/svg+xml',
      },
      {
        url: '/icons/favicon-32.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        url: '/icons/android-chrome-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
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
  setRequestLocale(locale)
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
        <noscript>
          <iframe
            src={
              `https://www.googletagmanager.com/ns.html` +
              `?id=${GTM_ID}` +
              (GTM_AUTH ? `&gtm_auth=${GTM_AUTH}` : '') +
              (GTM_PREVIEW
                ? `&gtm_preview=${GTM_PREVIEW}` + `&gtm_cookies_win=x`
                : '')
            }
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          />
        </noscript>
        <BodyScripts />
        <Providers params={params}>
          <Session>{children}</Session>
        </Providers>
      </body>
    </html>
  )
}
