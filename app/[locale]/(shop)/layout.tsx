import Header from 'components/common/Header'

import Footer from '@/components/common/Footer'
import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  return (
    <>
      <LocaleWrapper params={params} localeGroup={['Header', 'Common']}>
        <Header />
      </LocaleWrapper>
      <LocaleWrapper params={params} localeGroup="Home">
        {children}
      </LocaleWrapper>
      <Footer />
    </>
  )
}
