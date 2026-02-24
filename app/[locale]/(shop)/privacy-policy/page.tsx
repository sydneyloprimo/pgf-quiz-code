import type { Document } from '@contentful/rich-text-types'
import { getMessages } from 'next-intl/server'

import { PageHero } from '@/components/common/PageHero'
import { RichTextRenderer } from '@/components/common/RichTextRenderer'
import { getRichTextCopy } from '@/contentful/copy'

type PrivacyPolicyPageProps = {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = await params
  const contentfulContent = await getRichTextCopy(
    'PrivacyPolicy.content',
    locale
  )
  const messages = await getMessages()
  const privacyPolicy = (messages as Record<string, unknown>).PrivacyPolicy as
    | { content?: Document }
    | undefined
  const content = (contentfulContent ?? privacyPolicy?.content) as Document

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <PageHero translationKey="PrivacyPolicy.Hero" />
      <section className="w-full max-w-3xl px-5 py-16 md:py-24">
        <RichTextRenderer content={content} />
      </section>
    </main>
  )
}
