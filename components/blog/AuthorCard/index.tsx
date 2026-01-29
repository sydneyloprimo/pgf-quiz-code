import type { Asset } from 'contentful'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { AuthorEntry } from '@/contentful/types'

interface AuthorCardProps {
  author: AuthorEntry
  reviewDate?: string
}

const AuthorCard = ({ author, reviewDate }: AuthorCardProps) => {
  const t = useTranslations('BlogPost')
  const profilePicture = author.fields.profilePicture
  const profileUrl =
    profilePicture && 'fields' in profilePicture
      ? (profilePicture as Asset).fields?.file?.url
      : undefined

  return (
    <div className="flex items-center gap-6">
      {profileUrl && (
        <div className="relative size-28 flex-shrink-0 rounded-full">
          <Image
            src={`https:${profileUrl}`}
            alt={author.fields.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg leading-normal text-black">
          {author.fields.name}
        </p>
        <p className="font-sans text-lg leading-normal text-black">
          {author.fields.title}
          {reviewDate && (
            <>
              {' • '}
              {t('reviewedBy', { date: reviewDate })}
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export { AuthorCard }
