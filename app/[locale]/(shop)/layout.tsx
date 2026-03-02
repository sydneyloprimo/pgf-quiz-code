import Footer from '@/components/common/Footer'
import LocaleWrapper from '@/components/common/LocaleWrapper'
import { MainNav } from '@/components/common/MainNav'
import { NavSpacer } from '@/components/common/MainNav/NavSpacer'
import { SkipLink } from '@/components/common/SkipLink'
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
        localeGroup={['Accessibility', 'MainNav', 'Common']}
      >
        <SkipLink />
        <div className="w-full top-0 z-50">
          <MainNav />
        </div>
        <NavSpacer />
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
          'ContactInfo',
          'Formulation',
          'Home',
          'Recipes',
        ]}
      >
        {children}
      </LocaleWrapper>
      <LocaleWrapper params={params} localeGroup={['Footer', 'Common']}>
        <Footer />
      </LocaleWrapper>
    </>
  )
}
