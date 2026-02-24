import './[locale]/globals.css'

import Providers from 'utils/Providers'

import { NotFoundPage } from '@/components/not-found/NotFoundPage'
import { Locale } from '@/i18n'

const localeParams = Promise.resolve({ locale: Locale.EN })

export default function NotFound() {
  return (
    <Providers params={localeParams}>
      <NotFoundPage params={localeParams} />
    </Providers>
  )
}
