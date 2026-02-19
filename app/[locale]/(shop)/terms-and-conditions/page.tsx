import type { Document } from '@contentful/rich-text-types'

import { PageHero } from '@/components/common/PageHero'
import { RichTextRenderer } from '@/components/common/RichTextRenderer'
import { getRichTextCopy } from '@/contentful/copy'
import enMessages from '@/messages/en.json'

type TermsAndConditionsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function TermsAndConditionsPage({
  params,
}: TermsAndConditionsPageProps) {
  const { locale } = await params
  const contentfulContent = await getRichTextCopy(
    'TermsAndConditions.content',
    locale
  )
  const terms = (enMessages as Record<string, unknown>).TermsAndConditions as
    | { content?: Document }
    | undefined
  const content = (contentfulContent ?? terms?.content) as Document

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <PageHero translationKey="TermsAndConditions.Hero" />
      <section className="w-full max-w-3xl px-5 py-16 md:py-24">
        <RichTextRenderer content={content} />
      </section>
    </main>
  )
}
