import { useTranslations } from 'next-intl'

import { PageHero } from '@/components/common/PageHero'
import { RichTextRenderer } from '@/components/common/RichTextRenderer'
import type { RichTextDocument } from '@/components/common/RichTextRenderer'

export default function TermsAndConditionsPage() {
  const t = useTranslations('TermsAndConditions')

  const content = t.raw('content') as RichTextDocument

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <PageHero translationKey="TermsAndConditions.Hero" />
      <section className="w-full max-w-3xl px-5 py-16 md:py-24">
        <RichTextRenderer content={content} />
      </section>
    </main>
  )
}
