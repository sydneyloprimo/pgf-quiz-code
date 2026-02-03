import { getRequestConfig } from 'next-intl/server'

export enum Locale {
  EN = 'en',
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locale || locale !== Locale.EN) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
