import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Link } from '@/components/common/Link'
import { BlogPostEntry } from '@/contentful/types'
import { CategoryEntry } from '@/contentful/types'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

function isResolvedCategory(cat: unknown): cat is CategoryEntry {
  return (
    typeof cat === 'object' &&
    cat !== null &&
    'fields' in cat &&
    typeof (cat as CategoryEntry).fields?.name === 'string'
  )
}

interface FeaturedBlogPostProps {
  post: BlogPostEntry
  imageSrc: string
}

const FeaturedBlogPost = ({ post, imageSrc }: FeaturedBlogPostProps) => {
  const t = useTranslations('FeaturedBlogPost')
  const { title, slug, author, categories } = post.fields
  const authorResolved =
    author && typeof author === 'object' && 'fields' in author
  const authorName = authorResolved
    ? ((author as { fields: { name?: string; title?: string } }).fields?.name ??
      '')
    : ''
  const authorTitle = authorResolved
    ? ((author as { fields: { name?: string; title?: string } }).fields
        ?.title ?? '')
    : ''
  const categoryNames =
    categories && Array.isArray(categories)
      ? categories
          .filter(isResolvedCategory)
          .map((c) => c.fields.name)
          .filter(Boolean)
      : []

  const postHref = `${Routes.blog}/${slug}`

  return (
    <section className="w-full px-5 py-8 lg:px-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden">
        <div className="relative aspect-21/9 w-full min-h-64">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1152px, 100vw"
            priority
          />
          <div
            className={cn(
              'absolute inset-0 gradient-hero-overlay',
              'flex flex-col justify-end p-6 lg:p-10'
            )}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10">
            <span className="mb-3 inline-block w-fit bg-neutral-950 px-3 py-1 font-sans text-body-s text-neutral-white">
              {t('featured')}
            </span>
            {categoryNames.length > 0 && (
              <p className="mb-2 font-sans text-body-s text-neutral-white">
                {categoryNames.join(' | ')}
              </p>
            )}
            <Link
              href={postHref}
              className="font-display text-2xl leading-tight text-neutral-white no-underline hover:opacity-90 lg:text-3xl"
              aria-label={t('readPostAria', { title })}
            >
              {title}
            </Link>
            {(authorName || authorTitle) && (
              <p className="mt-2 font-sans text-body-s text-neutral-white">
                {[authorName, authorTitle].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { FeaturedBlogPost }
