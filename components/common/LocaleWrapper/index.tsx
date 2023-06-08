import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Locale } from '@/i18n'

interface Messages {
  [key: string]: Record<string, string> | Messages
}

type LocaleWrapperProps = PropsWithChildren<{
  params: { locale: Locale }
  localeGroup?: string[] | string
}>

const LocaleWrapper = async ({
  children,
  params: { locale },
  localeGroup,
}: LocaleWrapperProps) => {
  let messages: Messages
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default

    if (Array.isArray(localeGroup)) {
      const filteredMessages: Partial<Messages> = {}
      for (const group of localeGroup) {
        if (messages[group]) {
          filteredMessages[group] = { ...messages[group] }
        }
      }
      messages = filteredMessages as Messages
    } else if (typeof localeGroup === 'string') {
      if (messages[localeGroup]) {
        messages = { [localeGroup]: { ...messages[localeGroup] } }
      }
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
