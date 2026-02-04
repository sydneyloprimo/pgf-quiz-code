import withNextIntl from 'next-intl/plugin'

const withNextIntlPlugin = withNextIntl(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.shopify.com',
        pathname: '/**/**',
        protocol: 'https',
      },
      {
        hostname: 'images.ctfassets.net',
        pathname: '/**',
        protocol: 'https',
      },
    ],
  },
}

export default withNextIntlPlugin(nextConfig)
