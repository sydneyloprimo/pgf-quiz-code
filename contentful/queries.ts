import { contentfulClient } from './client'
import {
  CONTENTFUL_CONTENT_TYPES,
  CONTENTFUL_FIELDS,
  CONTENTFUL_QUERY_DEFAULTS,
} from './config'
import type {
  AuthorEntry,
  AuthorSkeleton,
  BlogPostEntry,
  BlogPostSkeleton,
  CategoryEntry,
  CategorySkeleton,
} from './types'

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
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      include: CONTENTFUL_QUERY_DEFAULTS.includeDepth,
      order: [...CONTENTFUL_QUERY_DEFAULTS.blogPostOrder],
    })
    const posts = response.items
    const categorySlug = options?.categorySlug
    if (!categorySlug) return posts
    return posts.filter((post) => {
      const categories = post.fields.categories
      if (!categories || !Array.isArray(categories)) return false
      return categories.some(
        (cat) => isResolvedCategory(cat) && cat.fields.slug === categorySlug
      )
    })
  } catch (error) {
    console.error('Error fetching blog posts for index:', error)
    return []
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostEntry | null> {
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      [`fields.${CONTENTFUL_FIELDS.slug}`]: slug,
      include: CONTENTFUL_QUERY_DEFAULTS.includeDepth,
      limit: 1,
    })

    return response.items[0] || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPostEntry[]> {
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      include: CONTENTFUL_QUERY_DEFAULTS.includeDepth,
      order: [...CONTENTFUL_QUERY_DEFAULTS.blogPostOrder],
    })

    return response.items
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.blogPost,
      select: [...CONTENTFUL_QUERY_DEFAULTS.slugSelect],
    })

    return response.items
      .map((item) => item.fields.slug)
      .filter(Boolean) as string[]
  } catch (error) {
    console.error('Error fetching blog slugs:', error)
    return []
  }
}
