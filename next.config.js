const withNextIntl = require('next-intl/plugin')(
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
    ],
  },
}

module.exports = withNextIntl(nextConfig)
