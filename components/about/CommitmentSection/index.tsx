import { useTranslations } from 'next-intl'

import { CommitmentCard } from '@/components/about/CommitmentSection/CommitmentCard'
import { COMMITMENT_ITEMS } from '@/constants'

const CommitmentSection = () => {
  const t = useTranslations('About.Commitment')

  const commitments = COMMITMENT_ITEMS.map((item) => ({
    text: t.rich(item.textKey, {
      bold: (chunks) => <strong className="font-semibold">{chunks}</strong>,
    }),
  }))

  return (
    <section className="w-full bg-tertiary-50 px-5 lg:px-24 py-10 lg:py-40 flex flex-col lg:gap-20 items-center lg:items-center">
      <h2 className="font-display font-normal text-3xl lg:text-4xl leading-12 tracking-tight text-secondary-950 text-center w-full">
        {t('title')}
      </h2>
      <div className="flex flex-col lg:flex-row gap-0 items-start lg:items-center w-full max-w-6xl mx-auto">
        {commitments.map((commitment, index) => {
          const commitmentItem = COMMITMENT_ITEMS[index]
          return (
            <CommitmentCard
              key={commitmentItem.textKey}
              text={commitment.text}
              hasBorder={index < commitments.length - 1}
            />
          )
        })}
      </div>
    </section>
  )
}

export { CommitmentSection }
