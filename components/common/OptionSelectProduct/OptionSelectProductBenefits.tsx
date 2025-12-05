'use client'

import { useTranslations } from 'next-intl'

import { AlertSuccessIcon, ShippingIcon } from '@/components/common/Icon'
import { formatShippingText } from '@/components/common/OptionSelectProduct/helpers'
import { cn } from '@/utils/cn'

interface Benefit {
  icon?: 'check' | 'shipping'
  text: string
}

interface OptionSelectProductBenefitsProps {
  benefits: Benefit[]
  shipmentFrequencyValue?: string
}

const OptionSelectProductBenefits = ({
  benefits,
  shipmentFrequencyValue,
}: OptionSelectProductBenefitsProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  return (
    <div className={cn('flex flex-col gap-3 bg-tertiary-100 p-4 mt-2')}>
      <h4 className="text-base font-semibold text-tertiary-900">
        {t('whatYoullGetTitle')}
      </h4>
      <ul className="flex flex-col gap-3">
        {benefits.map((benefit, index) => {
          const isShipping = benefit.icon === 'shipping'
          const nextBenefit = benefits[index + 1]
          const isLastShipping =
            isShipping && nextBenefit && nextBenefit.icon !== 'shipping'

          return (
            <li key={index} className="flex flex-col">
              <div className="flex gap-3 items-center">
                <div className="relative shrink-0 size-6">
                  {isShipping ? (
                    <ShippingIcon className="size-6 text-secondary-600" />
                  ) : (
                    <AlertSuccessIcon className="size-6 text-secondary-600" />
                  )}
                </div>
                <p className="text-body-m text-tertiary-900 flex-1">
                  {isShipping ? formatShippingText(benefit.text) : benefit.text}
                </p>
              </div>
              {isLastShipping && <div className="h-px bg-tertiary-300 mt-3" />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { OptionSelectProductBenefits }
export type { OptionSelectProductBenefitsProps, Benefit }
