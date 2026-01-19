import { useTranslations } from 'next-intl'
import type { ReactElement } from 'react'

import { CommitmentCard } from '@/components/about/CommitmentSection/CommitmentCard'
import {
  FeaturePharmIcon,
  GraduationCapIcon,
  PawPrintIcon,
} from '@/components/common/Icon'
import { COMMITMENT_ITEMS, type CommitmentIconType } from '@/constants'
import { cn } from '@/utils/cn'

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
    <section
      className={cn(
        'w-full',
        'bg-tertiary-50',
        'px-5 lg:px-24 py-10 lg:py-40',
        'flex flex-col',
        'lg:gap-20',
        'items-center lg:items-center'
      )}
    >
      <h2
        className={cn(
          'font-display font-normal',
          'text-3xl lg:text-4xl',
          'leading-12',
          'tracking-tight',
          'text-secondary-950',
          'text-center',
          'w-full'
        )}
      >
        {t('title')}
      </h2>
      <div
        className={cn(
          'flex flex-col lg:flex-row',
          'gap-0',
          'items-start lg:items-center',
          'w-full'
        )}
      >
        {commitments.map((commitment, index) => (
          <CommitmentCard
            key={index}
            icon={commitment.icon}
            text={commitment.text}
            hasBorder={index < commitments.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

export { CommitmentSection }
