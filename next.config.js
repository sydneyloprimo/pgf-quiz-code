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
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
      {
        hostname: 'images.ctfassets.net',
        pathname: '/**',
        protocol: 'https',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy product URLs
      {
        source: '/products',
        destination: '/recipes',
        permanent: true,
      },
      {
        source: '/products/:slug',
        destination: '/recipes',
        permanent: true,
      },
      // Legacy page aliases
      {
        source: '/our-formulation',
        destination: '/formulation',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/#faq',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/sign-in',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/sign-up',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth/sign-up',
        permanent: true,
      },
    ]
  },
}

export default withNextIntlPlugin(nextConfig)
