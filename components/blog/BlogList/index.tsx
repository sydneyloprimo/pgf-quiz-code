import { useTranslations } from 'next-intl'

import { BlogListCard } from '@/components/blog/BlogListCard'
import { Link } from '@/components/common/Link'
import { BlogPostEntry } from '@/contentful/types'
import { Routes } from '@/types/enums/routes'

interface BlogListProps {
  posts: BlogPostEntry[]
  currentPage: number
  totalPages: number
  categorySlug: string | null
}

const BlogList = ({
  posts,
  currentPage,
  totalPages,
  categorySlug,
}: BlogListProps) => {
  const t = useTranslations('BlogList')

  const buildPageHref = (page: number) => {
    const parts: string[] = []
    if (categorySlug) parts.push(`category=${encodeURIComponent(categorySlug)}`)
    if (page > 1) parts.push(`page=${page}`)
    const query = parts.join('&')
    return query ? `${Routes.blog}?${query}` : Routes.blog
  }

  const prevHref = currentPage > 1 ? buildPageHref(currentPage - 1) : null
  const nextHref =
    currentPage < totalPages ? buildPageHref(currentPage + 1) : null

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="w-full px-5 py-8 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 gap-x-20 md:grid-cols-2">
          {posts.map((post) => (
            <BlogListCard key={post.sys.id} post={post} />
          ))}
        </div>
        {totalPages > 1 && (
          <nav
            className="mt-8 flex justify-end gap-4"
            aria-label={t('paginationAria')}
          >
            {prevHref && (
              <Link
                href={prevHref}
                className="font-sans text-body-m text-primary-600"
                aria-label={t('previousPageAria')}
              >
                {t('previousPage')}
              </Link>
            )}
            {nextHref && (
              <Link
                href={nextHref}
                className="font-sans text-body-m text-primary-600"
                aria-label={t('nextPageAria')}
              >
                {t('nextPage')}
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  )
}

export { BlogList }
