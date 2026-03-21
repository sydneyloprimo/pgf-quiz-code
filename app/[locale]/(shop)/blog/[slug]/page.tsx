import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AuthorCard } from '@/components/blog/AuthorCard'
import { BlogPostCTA } from '@/components/blog/BlogPostCTA'
import { BlogPostHeader } from '@/components/blog/BlogPostHeader'
import { BlogPostReferences } from '@/components/blog/BlogPostReferences'
import {
  blogPostSchema,
  breadcrumbSchema,
  JsonLd,
} from '@/components/common/JsonLd'
import { RichTextRenderer } from '@/components/common/RichTextRenderer'
import { MAIN_CONTENT_ID, SITE_URL } from '@/constants'
import { getAllBlogSlugs, getBlogPostBySlug } from '@/contentful/queries'
import { Locale } from '@/i18n'

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ locale: Locale.EN, slug }))
}

interface BlogPostPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const blogPost = await getBlogPostBySlug(slug)
  const t = await getTranslations('BlogPost')

  if (!blogPost) {
    return {
      title: t('titleNotFound'),
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
  const { locale, slug } = await params
  setRequestLocale(locale)
  const blogPost = await getBlogPostBySlug(slug)
  const t = await getTranslations('BlogPostPage')

  if (!blogPost) {
    notFound()
  }

  const { title, subtitle, author, content, references } = blogPost.fields
  const reviewDate = new Date(blogPost.sys.updatedAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )

  const isAuthorResolved = author && 'fields' in author
  const authorName = isAuthorResolved
    ? (
        author as {
          fields: { name?: string }
        }
      ).fields?.name
    : undefined

  return (
    <article
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="bg-neutral-300 min-h-screen w-full"
    >
      <JsonLd
        data={blogPostSchema({
          title,
          description: subtitle ?? '',
          slug,
          authorName,
          datePublished: blogPost.sys.createdAt,
          dateModified: blogPost.sys.updatedAt,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          {
            name: title,
            url: `${SITE_URL}/blog/${slug}`,
          },
        ])}
      />
      <BlogPostHeader title={title} subtitle={subtitle} />

      {isAuthorResolved && (
        <AuthorCard author={author} reviewDate={reviewDate} />
      )}

      <section className="w-full px-5 lg:px-24 py-8">
        <p className="mx-auto max-w-6xl font-sans text-sm italic leading-normal text-black">
          {t('disclaimer')}
        </p>
      </section>

      <hr className="border-t border-neutral-700" />

      {content && (
        <section className="w-full px-5 lg:px-24 py-8">
          <div className="mx-auto max-w-6xl">
            <RichTextRenderer
              content={content}
              variant="blog"
              className="prose max-w-none"
            />
          </div>
        </section>
      )}

      <hr className="border-t border-neutral-700" />

      {references && references.length > 0 && (
        <BlogPostReferences references={references} />
      )}

      <BlogPostCTA variant="post" />
    </article>
  )
}
