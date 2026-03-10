import type { MetadataRoute } from 'next'

import { AI_SEARCH_BOT_USER_AGENTS, SITE_URL } from '@/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [...AI_SEARCH_BOT_USER_AGENTS],
        allow: '/',
        crawlDelay: 5,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/profile/', '/quiz/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
