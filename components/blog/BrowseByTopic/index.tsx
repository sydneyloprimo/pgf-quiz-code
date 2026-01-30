'use client'

import Image from 'next/image'
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap justify-center gap-3 lg:justify-start"
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
          <div className="relative flex shrink-0">
            <span
              className="pointer-events-none absolute left-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center"
              aria-hidden
            >
              <Image
                src="/icons/magnifying-glass.svg"
                alt=""
                width={20}
                height={20}
                className="opacity-70"
              />
            </span>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchAria')}
              className="w-full border border-neutral-950 bg-neutral-100 py-2 pl-10 pr-4 font-sans text-body-s text-neutral-950 placeholder:text-neutral-600 min-w-48 max-w-64 rounded-none"
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export { BrowseByTopic }
