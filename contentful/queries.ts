import { contentfulClient } from './client'
import {
  CONTENTFUL_CONTENT_TYPES,
  CONTENTFUL_FIELDS,
  CONTENTFUL_QUERY_DEFAULTS,
} from './config'
import { HARDCODED_BLOG_POSTS, HARDCODED_BLOG_SLUGS } from './hardcoded-posts'
import type {
  AuthorEntry,
  AuthorSkeleton,
  BlogPostEntry,
  BlogPostSkeleton,
  CategoryEntry,
  CategorySkeleton,
} from './types'

/**
 * Merges Contentful posts with hardcoded posts,
 * avoiding duplicates by slug and placing hardcoded
 * posts at the end.
 */
function mergeWithHardcoded(contentfulPosts: BlogPostEntry[]): BlogPostEntry[] {
  const existingSlugs = new Set(contentfulPosts.map((p) => p.fields.slug))
  const missing = HARDCODED_BLOG_POSTS.filter(
    (p) => !existingSlugs.has(p.fields.slug)
  )
  return [...contentfulPosts, ...missing]
}

function isResolvedCategory(cat: unknown): cat is CategoryEntry {
  return (
    typeof cat === 'object' &&
    cat !== null &&
    'fields' in cat &&
    typeof (cat as CategoryEntry).fields?.slug === 'string'
  )
}

export async function getCategories(): Promise<CategoryEntry[]> {
  try {
    const response = await contentfulClient.getEntries<CategorySkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.category,
    })
    return response.items
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getAuthors(): Promise<AuthorEntry[]> {
  try {
    const response = await contentfulClient.getEntries<AuthorSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.author,
      include: 0,
    })
    return response.items
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

export interface GetBlogPostsForIndexOptions {
  categorySlug?: string
}

export async function getBlogPostsForIndex(
  options?: GetBlogPostsForIndexOptions
): Promise<BlogPostEntry[]> {
  let posts: BlogPostEntry[]
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      include: CONTENTFUL_QUERY_DEFAULTS.includeDepth,
      order: [...CONTENTFUL_QUERY_DEFAULTS.blogPostOrder],
    })
    posts = mergeWithHardcoded(response.items)
  } catch (error) {
    console.error('Error fetching blog posts for index:', error)
    posts = HARDCODED_BLOG_POSTS
  }
  const categorySlug = options?.categorySlug
  if (!categorySlug) return posts
  return posts.filter((post) => {
    const categories = post.fields.categories
    if (!categories || !Array.isArray(categories)) return false
    return categories.some(
      (cat) => isResolvedCategory(cat) && cat.fields.slug === categorySlug
    )
  })
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostEntry | null> {
  const hardcoded = HARDCODED_BLOG_POSTS.find((p) => p.fields.slug === slug)
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      [`fields.${CONTENTFUL_FIELDS.slug}`]: slug,
      include: CONTENTFUL_QUERY_DEFAULTS.includeDepth,
      limit: 1,
    })

    return response.items[0] || hardcoded || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return hardcoded || null
  }
}

export async function getAllBlogPosts(): Promise<BlogPostEntry[]> {
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      include: CONTENTFUL_QUERY_DEFAULTS.includeDepth,
      order: [...CONTENTFUL_QUERY_DEFAULTS.blogPostOrder],
    })

    return mergeWithHardcoded(response.items)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return HARDCODED_BLOG_POSTS
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      select: [...CONTENTFUL_QUERY_DEFAULTS.slugSelect],
    })

    const contentfulSlugs = response.items
      .map((item) => item.fields.slug)
      .filter(Boolean) as string[]
    const allSlugs = Array.from(
      new Set([...contentfulSlugs, ...HARDCODED_BLOG_SLUGS])
    )
    return allSlugs
  } catch (error) {
    console.error('Error fetching blog slugs:', error)
    return [...HARDCODED_BLOG_SLUGS]
  }
}
