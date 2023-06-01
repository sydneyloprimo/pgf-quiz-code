import LocaleWrapper from '@/components/common/LocaleWrapper'
import { Locale } from '@/i18n'
import Header from 'components/common/Header'

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { locale: Locale }
}) {
  return (
    <>
      <LocaleWrapper params={params} localeGroup="Header">
        <Header />
      </LocaleWrapper>
      {children}
    </>
  )
}
