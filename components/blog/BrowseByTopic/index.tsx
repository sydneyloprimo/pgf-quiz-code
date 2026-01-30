'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Link } from '@/components/common/Link'
import { CategoryEntry } from '@/contentful/types'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface BrowseByTopicProps {
  categories: CategoryEntry[]
  currentSlug: string | null
}

const BrowseByTopic = ({ categories, currentSlug }: BrowseByTopicProps) => {
  const t = useTranslations('BrowseByTopic')

  const buildHref = useCallback((slug: string | null) => {
    const base = Routes.blog
    if (!slug) return base
    return `${base}?category=${encodeURIComponent(slug)}`
  }, [])

  return (
    <section className="w-full px-5 py-8 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="heading-h4 mb-6 text-center text-secondary-950">
          {t('title')}
        </h2>
        <div
          className="flex flex-wrap justify-center gap-3"
          role="group"
          aria-label={t('title')}
        >
          <Link
            href={buildHref(null)}
            className={cn(
              'border px-4 py-2 font-sans text-body-s',
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
            return (
              <Link
                key={cat.sys.id}
                href={buildHref(slug)}
                className={cn(
                  'border px-4 py-2 font-sans text-body-s',
                  isSelected
                    ? 'border-neutral-950 bg-neutral-200 text-neutral-950'
                    : 'border-neutral-950 bg-neutral-100 text-neutral-950'
                )}
                aria-label={t('filterByCategoryAria', { name })}
                aria-pressed={isSelected}
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
