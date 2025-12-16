import { AnnouncementToast } from '@/components/common/AnnouncementToast'
import Footer from '@/components/common/Footer'
import LocaleWrapper from '@/components/common/LocaleWrapper'
import { MainNav } from '@/components/common/MainNav'
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
      <LocaleWrapper
        params={params}
        localeGroup={['MainNav', 'AnnouncementToast', 'Common']}
      >
        <div className="sticky top-0 z-50">
          <MainNav />
          <AnnouncementToast />
        </div>
      </LocaleWrapper>
      <LocaleWrapper params={params} localeGroup="Home">
        {children}
      </LocaleWrapper>
      <LocaleWrapper params={params} localeGroup="Footer">
        <Footer />
      </LocaleWrapper>
    </>
  )
}
