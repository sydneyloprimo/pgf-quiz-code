import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Locale } from '@/i18n'

type LocaleWrapperProps = PropsWithChildren<{
  params: { locale: Locale }
  localeGroup?: string
}>

const LocaleWrapper = async ({
  children,
  params: { locale },
  localeGroup,
}: LocaleWrapperProps) => {
  let messages
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default

    if (localeGroup && messages[localeGroup]) {
      messages = { [localeGroup]: { ...messages[localeGroup] } }
    }
  } catch (error) {
    console.log(error)
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
export default LocaleWrapper as unknown as (
  props: LocaleWrapperProps
) => JSX.Element
