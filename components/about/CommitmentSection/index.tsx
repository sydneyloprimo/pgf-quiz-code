import { useTranslations } from 'next-intl'
import type { ReactElement } from 'react'

import { CommitmentCard } from '@/components/about/CommitmentSection/CommitmentCard'
import {
  FeaturePharmIcon,
  GraduationCapIcon,
  PawPrintIcon,
} from '@/components/common/Icon'
import { COMMITMENT_ITEMS, type CommitmentIconType } from '@/constants'

const getCommitmentIcon = (iconType: CommitmentIconType): ReactElement => {
  const iconProps = { className: 'size-11' }
  switch (iconType) {
    case 'featurePharm':
      return <FeaturePharmIcon {...iconProps} />
    case 'graduationCap':
      return <GraduationCapIcon {...iconProps} />
    case 'pawPrint':
      return <PawPrintIcon {...iconProps} />
  }
}

const CommitmentSection = () => {
  const t = useTranslations('About.Commitment')

  const commitments = COMMITMENT_ITEMS.map((item) => ({
    icon: getCommitmentIcon(item.iconType),
    text: t(item.textKey),
  }))

  return (
    <section className="w-full bg-tertiary-50 px-5 lg:px-24 py-10 lg:py-40 flex flex-col lg:gap-20 items-center lg:items-center">
      <h2 className="font-display font-normal text-3xl lg:text-4xl leading-12 tracking-tight text-secondary-950 text-center w-full">
        {t('title')}
      </h2>
      <div className="flex flex-col lg:flex-row gap-0 items-start lg:items-center w-full">
        {commitments.map((commitment, index) => {
          const commitmentItem = COMMITMENT_ITEMS[index]
          return (
            <CommitmentCard
              key={commitmentItem.iconType}
              icon={commitment.icon}
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
