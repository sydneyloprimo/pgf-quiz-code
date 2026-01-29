import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Locale } from '@/i18n'

interface Messages {
  [key: string]: any
}

type LocaleWrapperProps = PropsWithChildren<{
  params: Promise<{ locale: Locale }>
  localeGroup?: string[] | string
}>

const LocaleWrapper = async ({
  children,
  params,
  localeGroup,
}: LocaleWrapperProps) => {
  const { locale } = await params
  let messages: Messages
  try {
    if (locale !== Locale.EN) {
      throw new Error(`Unsupported locale: ${locale}`)
    }
    messages = (await import('@/messages/en.json')).default

    if (Array.isArray(localeGroup)) {
      const filteredMessages: Messages = localeGroup.reduce((result, group) => {
        if (messages[group]) {
          result[group] = { ...messages[group] }
        }
        return result
      }, {} as Messages)
      messages = filteredMessages
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
export default LocaleWrapper
