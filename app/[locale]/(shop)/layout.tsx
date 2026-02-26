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
      <LocaleWrapper params={params} localeGroup={['MainNav', 'Common']}>
        <div className="w-full top-0 z-50">
          <MainNav />
        </div>
      </LocaleWrapper>
      <LocaleWrapper
        params={params}
        localeGroup={[
          'About',
          'BlogIndex',
          'BlogPost',
          'BlogPostCTA',
          'BlogPostPage',
          'Common',
          'Formulation',
          'Home',
          'Recipes',
        ]}
      >
        {children}
      </LocaleWrapper>
      <LocaleWrapper params={params} localeGroup="Footer">
        <Footer />
      </LocaleWrapper>
    </>
  )
}
