'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import { useConciergeContact } from '@/hooks/useConciergeContact'
import { Routes } from '@/types/enums/routes'

const BlogPostCTA = () => {
  const tCTA = useTranslations('BlogPostCTA')
  const tBlog = useTranslations('BlogPost')
  const { href } = useConciergeContact()

  return (
    <section className="w-full bg-neutral-white px-5 py-16 lg:px-24 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2 className="font-display text-4xl leading-normal text-quaternary-800 mb-6">
          {tCTA('title')}
        </h2>
        <p className="font-sans text-base leading-normal text-black mb-8 max-w-3xl">
          {tCTA('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            variant="primary"
            className="px-5 py-3"
            onClick={() => {
              window.location.href = Routes.quiz
            }}
          >
            {tBlog('buildPlanButton')}
          </Button>
          <Link
            href={href}
            className="font-sans text-xs font-bold underline text-black"
          >
            {tBlog('talkToNutritionists')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export { BlogPostCTA }
