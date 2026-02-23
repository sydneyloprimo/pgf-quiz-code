import { useTranslations } from 'next-intl'

import { AuthorEntry } from '@/contentful/types'

interface MeetTheContributorsProps {
  authors: AuthorEntry[]
}

const MeetTheContributors = ({ authors }: MeetTheContributorsProps) => {
  const t = useTranslations('MeetTheContributors')

  if (authors.length === 0) return null

  return (
    <section className="w-full px-5 pt-20 pb-8 lg:px-24 lg:pt-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl font-normal leading-none tracking-normal text-secondary-950">
          {t('title')}
        </h2>
        <div className="mt-4 w-full border-t border-secondary-900" />
        <div className="flex flex-wrap justify-between gap-8 pt-8 lg:gap-12">
          {authors.map((author) => (
            <div
              key={author.sys.id}
              className="flex min-w-0 flex-col gap-2 text-left lg:min-w-48"
            >
              <p className="font-display text-2xl font-normal leading-none tracking-normal text-neutral-950">
                {author.fields.name}
              </p>
              <p className="mt-2 font-sans text-sm font-normal leading-[18px] tracking-normal text-neutral-black">
                {author.fields.title}
              </p>
              <p className="font-sans text-sm font-normal leading-[18px] tracking-normal text-neutral-black">
                {t('contributorRole')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { MeetTheContributors }
