import './globals.css'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { useLocale } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Locale } from '@/i18n'
import BodyScripts from '@/scripts/BodyScripts'
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
      <head>
        <Script id="clarity-analytics">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "lqcfxk6bco");
            `}
        </Script>
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
