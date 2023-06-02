import { getRequestConfig } from 'next-intl/server'

export enum Locale {
  EN = 'en',
  ES = 'es',
}

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))
