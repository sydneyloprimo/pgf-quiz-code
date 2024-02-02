import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  localePrefix: 'always',
  // A list of all locales that are supported
  locales: ['en', 'es'],
})

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
