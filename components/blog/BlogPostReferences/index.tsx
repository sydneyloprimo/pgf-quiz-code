'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useId, useState } from 'react'

import { ChevronIcon } from '@/components/common/Icon'

interface BlogPostReferencesProps {
  references: string[]
}

const BlogPostReferences = ({ references }: BlogPostReferencesProps) => {
  const t = useTranslations('BlogPostPage')
  const [isOpen, setIsOpen] = useState(false)
  const referencesListId = useId()
  const buttonId = useId()

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <section className="w-full space-y-2 px-5 py-8 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-base leading-normal text-black">
          {t('references')}
        </h2>
        <p className="font-sans text-sm leading-normal text-black">
          {t('referencesDescription')}
        </p>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={referencesListId}
          className="flex items-center gap-1 font-sans text-sm text-black underline"
          onClick={handleToggle}
        >
          {t('showReferences')}
          <ChevronIcon
            aria-hidden
            direction={isOpen ? 'up' : 'down'}
            className="size-4 transition-transform"
          />
        </button>
        {isOpen && (
          <ol
            id={referencesListId}
            role="region"
            aria-labelledby={buttonId}
            className="mt-4 list-decimal space-y-1 pl-6 font-sans text-sm leading-normal text-black"
          >
            {references.map((ref, index) => (
              <li key={`${index}-${ref}`}>{ref}</li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

export { BlogPostReferences }
