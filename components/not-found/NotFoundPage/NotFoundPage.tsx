import Footer from '@/components/common/Footer'
import LocaleWrapper from '@/components/common/LocaleWrapper'
import { MainNav } from '@/components/common/MainNav'
import { NotFoundContent } from '@/components/not-found/NotFoundContent'
import { MAIN_CONTENT_ID } from '@/constants'
import { Locale } from '@/i18n'

interface NotFoundPageProps {
  params: Promise<{ locale: Locale }>
}

const NotFoundPage = ({ params }: NotFoundPageProps) => (
  <main
    id={MAIN_CONTENT_ID}
    tabIndex={-1}
    className="flex flex-col items-center w-full bg-neutral-300 min-h-screen"
  >
    <LocaleWrapper params={params} localeGroup={['MainNav', 'Common']}>
      <div className="w-full top-0 z-50">
        <MainNav />
      </div>
    </LocaleWrapper>
    <LocaleWrapper params={params} localeGroup="NotFound">
      <NotFoundContent />
    </LocaleWrapper>
    <LocaleWrapper params={params} localeGroup="Footer">
      <Footer />
    </LocaleWrapper>
  </main>
)

export { NotFoundPage }
