import './globals.css'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { useLocale } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Locale } from '@/i18n'
import Providers from 'utils/Providers'
import Session from 'utils/Session'

export const metadata: Metadata = {
  description:
    'Discover the best in online shopping at RS Blackmarket! We offer a wide range of products from furniture, tech gadgets to home decor. Enjoy great deals, fast shipping, and top-notch customer service. Explore now and experience effortless shopping at your fingertips.',
  openGraph: {
    description:
      'Discover the best in online shopping at RS Blackmarket! We offer a wide range of products from furniture, tech gadgets to home decor. Enjoy great deals, fast shipping, and top-notch customer service. Explore now and experience effortless shopping at your fingertips.',
    images: '/images/temporary-metadata-image.png',
    title: 'RS Blackmarket',
  },
  title: 'RS Blackmarket',
}

type RootLayoutProps = PropsWithChildren<{
  params: { locale: Locale }
}>

export default function RootLayout({ children, params }: RootLayoutProps) {
  const locale = useLocale()

  if (params.locale !== locale) {
    notFound()
  }

  return (
    <html className="bg-dark-violet" lang={locale}>
      <body className="flex items-center flex-col">
        <Providers params={params}>
          <Session>{children}</Session>
        </Providers>
      </body>
    </html>
  )
}
