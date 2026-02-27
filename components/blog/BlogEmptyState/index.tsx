import { useTranslations } from 'next-intl'

const BlogEmptyState = () => {
  const t = useTranslations('BlogIndex.EmptyState')

  return (
    <section
      className="flex w-full items-center justify-center px-5 py-24"
      aria-label={t('ariaLabel')}
    >
      <p className="heading-h2 text-center text-secondary-950">
        {t('comingSoon')}
      </p>
    </section>
  )
}

export { BlogEmptyState }
