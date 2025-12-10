'use client'

import { useTranslations } from 'next-intl'

import { AlertSuccessIcon } from '@/components/common/Icon'

interface Benefit {
  icon?: 'check' | 'shipping'
  text: string
}

interface OptionSelectProductBenefitsAlaCarteProps {
  benefits: Benefit[]
}

const OptionSelectProductBenefitsAlaCarte = ({
  benefits,
}: OptionSelectProductBenefitsAlaCarteProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  return (
    <div className="flex flex-col gap-3 bg-tertiary-100 p-4 mt-2">
      <h4 className="text-base font-semibold text-tertiary-900">
        {t('whatYoullGetTitle')}
      </h4>
      <ul className="flex flex-col gap-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex gap-3 items-center">
            <div className="relative shrink-0 size-6">
              <AlertSuccessIcon className="size-6 text-secondary-600" />
            </div>
            <p className="text-body-m text-tertiary-900 flex-1">
              {benefit.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { OptionSelectProductBenefitsAlaCarte }
export type { OptionSelectProductBenefitsAlaCarteProps, Benefit }
