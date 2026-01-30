import { useTranslations } from 'next-intl'

import { Link } from '@/components/common/Link'
import { BlogPostEntry } from '@/contentful/types'
import { Routes } from '@/types/enums/routes'

interface BlogListCardProps {
  post: BlogPostEntry
}

const BLOG_LIST_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}

const BlogListCard = ({ post }: BlogListCardProps) => {
  const t = useTranslations('BlogList')
  const { title, subtitle, slug, author } = post.fields
  const date = new Date(post.sys.updatedAt).toLocaleDateString(
    'en-US',
    BLOG_LIST_DATE_OPTIONS
  )
  const authorResolved =
    author && typeof author === 'object' && 'fields' in author
  const authorName = authorResolved
    ? ((author as { fields: { name?: string } }).fields?.name ?? '')
    : ''

  const postHref = `${Routes.blog}/${slug}`

  return (
    <article className="flex flex-col gap-2">
      <Link
        href={postHref}
        className="heading-h5 text-secondary-950 no-underline hover:underline"
      >
        {title}
      </Link>
      {subtitle && (
        <p className="font-sans text-body-m leading-normal text-neutral-950">
          {subtitle}
        </p>
      )}
      <p className="font-sans text-body-s leading-normal text-neutral-700">
        {t('postAuthorAndDate', {
          author: authorName || '—',
          date,
        })}
      </p>
    </article>
  )
}

export { BlogListCard }
