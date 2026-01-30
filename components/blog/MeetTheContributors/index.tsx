import { useTranslations } from 'next-intl'

import { AuthorEntry } from '@/contentful/types'

interface MeetTheContributorsProps {
  authors: AuthorEntry[]
}

const MeetTheContributors = ({ authors }: MeetTheContributorsProps) => {
  const t = useTranslations('MeetTheContributors')

  if (authors.length === 0) return null

  return (
    <section className="w-full px-5 py-8 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="heading-h4 mb-6 text-center text-secondary-950">
          {t('title')}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {authors.map((author) => (
            <div
              key={author.sys.id}
              className="flex min-w-0 max-w-64 flex-col gap-1 text-center"
            >
              <p className="font-display text-lg leading-normal text-neutral-950">
                {author.fields.name}
              </p>
              <p className="font-sans text-body-m leading-normal text-neutral-700">
                {author.fields.title}
              </p>
              <p className="font-sans text-body-s leading-normal text-neutral-700">
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
