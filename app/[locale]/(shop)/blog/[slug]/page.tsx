import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AuthorCard } from '@/components/blog/AuthorCard'
import { BlogPostCTA } from '@/components/blog/BlogPostCTA'
import { BlogPostHeader } from '@/components/blog/BlogPostHeader'
import { RichTextRenderer } from '@/components/common/RichTextRenderer'
import { getBlogPostBySlug } from '@/contentful/queries'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const blogPost = await getBlogPostBySlug(slug)

  if (!blogPost) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  const { title, subtitle } = blogPost.fields

  return {
    description: subtitle,
    openGraph: {
      description: subtitle,
      title,
    },
    title,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const blogPost = await getBlogPostBySlug(slug)
  const t = await getTranslations('BlogPost')

  if (!blogPost) {
    notFound()
  }

  const { title, subtitle, author, content } = blogPost.fields
  const reviewDate = new Date(blogPost.sys.updatedAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )

  const isAuthorResolved = author && 'fields' in author

  return (
    <div className="bg-neutral-300 min-h-screen">
      <div className="mx-auto max-w-6xl px-5 lg:px-24 py-16 lg:py-20">
        <article className="space-y-8">
          <BlogPostHeader title={title} subtitle={subtitle} />

          {isAuthorResolved && (
            <AuthorCard author={author} reviewDate={reviewDate} />
          )}

          <p className="font-sans text-sm italic leading-normal text-black">
            {t('disclaimer')}
          </p>

          <hr className="border-t border-neutral-400" />

          {content && (
            <RichTextRenderer
              content={content}
              variant="blog"
              className="prose max-w-none"
            />
          )}

          <hr className="border-t border-neutral-400 mt-16" />

          <section className="space-y-2">
            <h2 className="font-display text-base leading-normal text-black">
              {t('references')}
            </h2>
            <p className="font-sans text-sm leading-normal text-black">
              {t('referencesDescription')}
            </p>
            <button
              type="button"
              className="font-sans text-sm underline text-black"
            >
              {t('showReferences')}
            </button>
          </section>

          <BlogPostCTA />
        </article>
      </div>
    </div>
  )
}
