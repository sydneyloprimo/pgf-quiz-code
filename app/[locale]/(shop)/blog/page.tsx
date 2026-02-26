import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { BlogIndexHero } from '@/components/blog/BlogIndexHero'
import { BlogList } from '@/components/blog/BlogList'
import { BlogPostCTA } from '@/components/blog/BlogPostCTA'
import { BrowseByTopic } from '@/components/blog/BrowseByTopic'
import { FeaturedBlogPost } from '@/components/blog/FeaturedBlogPost'
import { MeetTheContributors } from '@/components/blog/MeetTheContributors'
import {
  BLOG_FEATURED_IMAGE_PATH,
  BLOG_INDEX_POSTS_PER_PAGE,
  MAIN_CONTENT_ID,
} from '@/constants'
import {
  getAuthors,
  getBlogPostsForIndex,
  getCategories,
} from '@/contentful/queries'

interface BlogIndexPageProps {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('BlogIndex')
  const headline = t('heroHeadline')
  return {
    description: t('heroSubheadline'),
    openGraph: {
      description: t('heroSubheadline'),
      title: headline,
    },
    title: headline,
  }
}

export default async function BlogIndexPage({
  searchParams,
}: BlogIndexPageProps) {
  const params = await searchParams
  const categorySlug = params.category ?? null
  const pageRaw = params.page
  const currentPage = Math.max(1, Number.parseInt(String(pageRaw), 10) || 1)

  const [categories, authors, allPosts] = await Promise.all([
    getCategories(),
    getAuthors(),
    getBlogPostsForIndex(categorySlug ? { categorySlug } : undefined),
  ])

  const totalPages = Math.ceil(allPosts.length / BLOG_INDEX_POSTS_PER_PAGE)
  const safePage = Math.min(currentPage, totalPages || 1)
  const start = (safePage - 1) * BLOG_INDEX_POSTS_PER_PAGE
  const listPosts = allPosts.slice(start, start + BLOG_INDEX_POSTS_PER_PAGE)
  const featuredPost = allPosts[0] ?? null

  const t = await getTranslations('BlogIndex')

  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="min-h-screen w-full bg-neutral-300"
    >
      <BlogIndexHero
        headline={t('heroHeadline')}
        subheadline={t('heroSubheadline')}
      />
      <BrowseByTopic categories={categories} currentSlug={categorySlug} />
      {featuredPost && (
        <FeaturedBlogPost
          post={featuredPost}
          imageSrc={BLOG_FEATURED_IMAGE_PATH}
        />
      )}
      <BlogList
        posts={listPosts}
        currentPage={safePage}
        totalPages={totalPages}
        categorySlug={categorySlug}
      />
      <MeetTheContributors authors={authors} />
      <BlogPostCTA />
    </main>
  )
}
