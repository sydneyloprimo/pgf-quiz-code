'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Link } from '@/components/common/Link'
import { CategoryEntry } from '@/contentful/types'
import { CtaLocation, CtaName } from '@/types/enums/events'
import { Routes } from '@/types/enums/routes'
import { trackCtaClick } from '@/utils/analytics'
import { cn } from '@/utils/cn'

interface BrowseByTopicProps {
  categories: CategoryEntry[]
  currentSlug: string | null
}

const BrowseByTopic = ({ categories, currentSlug }: BrowseByTopicProps) => {
  const t = useTranslations('BlogIndex.BrowseByTopic')

  const buildHref = useCallback((slug?: string | null) => {
    const base = Routes.blog
    if (!slug) return base
    return `${base}?category=${encodeURIComponent(slug)}`
  }, [])

  const handleCategoryFilter = useCallback((category: string) => {
    trackCtaClick(CtaName.categoryFilter, CtaLocation.blogBrowse, { category })
  }, [])

  return (
    <section className="w-full px-5 pb-8 pt-4 lg:px-24 lg:pt-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center font-display text-4xl font-normal leading-none tracking-normal text-quaternary-800">
          {t('title')}
        </h2>
        <div
          className="mx-auto flex w-full flex-wrap justify-center gap-3 lg:w-3/4"
          role="group"
          aria-label={t('title')}
        >
          <Link
            href={buildHref()}
            className={cn(
              'rounded-none border px-4 py-2 font-sans text-body-s focus:rounded-none',
              currentSlug === null
                ? 'border-neutral-950 bg-neutral-200 text-neutral-950'
                : 'border-neutral-950 bg-neutral-100 text-neutral-950'
            )}
            aria-label={t('selectAllAria')}
          >
            {t('all')}
          </Link>
          {categories.map((cat) => {
            const slug = cat.fields.slug ?? ''
            const name = cat.fields.name ?? ''
            const isSelected = currentSlug === slug
            const handleClick = () => handleCategoryFilter(slug)
            return (
              <Link
                key={cat.sys.id}
                href={buildHref(slug)}
                className={cn(
                  'rounded-none border px-4 py-2 font-sans text-body-s focus:rounded-none',
                  isSelected
                    ? 'border-neutral-950 bg-neutral-200 text-neutral-950'
                    : 'border-neutral-950 bg-neutral-100 text-neutral-950'
                )}
                aria-label={t('filterByCategoryAria', { name })}
                aria-pressed={isSelected}
                onClick={handleClick}
              >
                {name}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { BrowseByTopic }
