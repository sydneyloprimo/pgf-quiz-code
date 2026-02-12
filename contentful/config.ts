/**
 * Contentful configuration - centralizes content types, field names,
 * and query defaults for easier maintenance.
 */

export const CONTENTFUL_CONTENT_TYPES = {
  blogPost: 'blogPost',
  category: 'category',
  author: 'author',
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
