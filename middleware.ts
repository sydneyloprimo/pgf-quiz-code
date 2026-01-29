import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  defaultLocale: 'en',
  localePrefix: 'never',
  locales: ['en'],
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
