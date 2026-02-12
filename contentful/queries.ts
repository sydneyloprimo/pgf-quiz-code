import { contentfulClient } from './client'
import {
  CONTENTFUL_CONTENT_TYPES,
  CONTENTFUL_FIELDS,
  CONTENTFUL_QUERY_DEFAULTS,
} from './config'
import { BlogPostEntry, BlogPostSkeleton } from './types'

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
