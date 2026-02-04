import { contentfulClient } from './client'
import { BlogPostEntry, BlogPostSkeleton } from './types'

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostEntry | null> {
  try {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2,
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
      content_type: 'blogPost',
      include: 2,
      order: ['-sys.createdAt'],
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
      content_type: 'blogPost',
      select: ['fields.slug'],
    })

    return response.items
      .map((item) => item.fields.slug)
      .filter(Boolean) as string[]
  } catch (error) {
    console.error('Error fetching blog slugs:', error)
    return []
  }
}
