import { getRequestConfig } from 'next-intl/server'

export enum Locale {
  EN = 'en',
  ES = 'es',
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  // Ensure locale is defined and valid
  if (!locale || (locale !== Locale.EN && locale !== Locale.ES)) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
