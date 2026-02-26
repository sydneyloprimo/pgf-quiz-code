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
} as const

export const CONTENTFUL_FIELDS = {
  slug: 'slug',
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
