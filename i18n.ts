import { getRequestConfig } from 'next-intl/server'

import {
  getContentfulCopyMap,
  mergeContentfulIntoMessages,
} from '@/contentful/copy'

export enum Locale {
  EN = 'en',
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locale || locale !== Locale.EN) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  const messages = (await import(`./messages/${locale}.json`))
    .default as Record<string, unknown>
  const contentfulCopy = await getContentfulCopyMap(locale)
  const merged =
    Object.keys(contentfulCopy).length > 0
      ? mergeContentfulIntoMessages(messages, contentfulCopy)
      : messages

  return {
    locale,
    messages: merged,
  }
})
