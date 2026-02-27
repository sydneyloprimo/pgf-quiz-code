'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { Link } from '@/components/common/Link'
import { MOBILE_WIDTH } from '@/constants'
import { BlogPostEntry } from '@/contentful/types'
import { CategoryEntry } from '@/contentful/types'
import { Routes } from '@/types/enums/routes'

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
  imageDesktopSrc: string
  imageMobileSrc: string
}

const FeaturedBlogPost = ({
  post,
  imageDesktopSrc,
  imageMobileSrc,
}: FeaturedBlogPostProps) => {
  const t = useTranslations('BlogIndex.FeaturedBlogPost')
  const [imageSrc, setImageSrc] = useState(imageDesktopSrc)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`)
    const updateSrc = () => {
      setImageSrc(mq.matches ? imageMobileSrc : imageDesktopSrc)
    }
    updateSrc()
    mq.addEventListener('change', updateSrc)
    return () => mq.removeEventListener('change', updateSrc)
  }, [imageDesktopSrc, imageMobileSrc])
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
          <img
            src={imageSrc}
            alt={t('featuredImageAlt', { title })}
            className="absolute inset-0 size-full object-cover"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/50 to-neutral-950/60"
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-10">
            <h2 className="font-display text-2xl leading-tight text-neutral-white lg:text-3xl">
              {t('featured')}
            </h2>
            <div className="flex flex-col">
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
      </div>
    </section>
  )
}

export { FeaturedBlogPost }
