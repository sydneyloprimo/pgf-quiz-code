/**
 * Contentful configuration - centralizes content types, field names,
 * and query defaults for easier maintenance.
 */

export const CONTENTFUL_CONTENT_TYPES = {
  author: 'author',
  blogPost: 'blogPost',
  category: 'category',
  customerReview: 'customerReview',
  featureFlag: 'featureFlag',
  tableRichText: 'tableRichText',
} as const

export const CONTENTFUL_LOCALE = 'en-US' as const

export const CONTENTFUL_TAGS = {
  pageHome: { id: 'pageHome', name: 'page:Home' },
} as const

export const CONTENTFUL_FIELDS = {
  key: 'key',
  slug: 'slug',
  table: 'table',
} as const

export const CONTENTFUL_QUERY_DEFAULTS = {
  /** Include depth for linked entries (author, categories) */
  includeDepth: 2,
  /** Default order for blog posts: newest first */
  blogPostOrder: ['-sys.createdAt'] as const,
  /** Minimal select for slug-only queries */
  slugSelect: ['fields.slug'] as const,
} as const

export const CONTENTFUL_CLIENT_DEFAULTS = {
  /** CDN host - use preview.contentful.com for draft content */
  host: 'cdn.contentful.com' as const,
} as const

export const RECIPE_TABLE_KEYS = {
  turkey: {
    guaranteedAnalysis: 'turkey-guaranteed-analysis',
    minerals: 'turkey-minerals',
    vitamins: 'turkey-vitamins',
    fats: 'turkey-fats',
    aminoAcids: 'turkey-amino-acids',
  },
  lamb: {
    guaranteedAnalysis: 'lamb-guaranteed-analysis',
    minerals: 'lamb-minerals',
    vitamins: 'lamb-vitamins',
    fats: 'lamb-fats',
    aminoAcids: 'lamb-amino-acids',
  },
  seafood: {
    guaranteedAnalysis: 'seafood-guaranteed-analysis',
    minerals: 'seafood-minerals',
    vitamins: 'seafood-vitamins',
    fats: 'seafood-fats',
    aminoAcids: 'seafood-amino-acids',
  },
} as const

export const CONTENTFUL_ENVIRONMENTS = {
  master: 'master',
  staging: 'staging',
} as const

/**
 * Returns the Contentful environment ID for data fetching.
 * - CONTENTFUL_ENVIRONMENT env var: explicit override
 * - VERCEL_ENV=production: master (production)
 * - Otherwise: staging (develop, qa, preview, local)
 */
export function getContentfulEnvironmentId(): string {
  const explicit = process.env.CONTENTFUL_ENVIRONMENT
  if (explicit) return explicit
  if (process.env.VERCEL_ENV === 'production') {
    return CONTENTFUL_ENVIRONMENTS.master
  }
  return CONTENTFUL_ENVIRONMENTS.staging
}
