'use client'

import { useTranslations } from 'next-intl'

import { InputDropdown } from '@/components/common/InputDropdown'

interface DropdownOption {
  label: string
  value: string
}

interface OptionSelectProductDropdownsProps {
  recipeOptions: DropdownOption[]
  recipeValue?: string
  onRecipeSelect?: (value: string) => void
  shipmentFrequencyOptions: DropdownOption[]
  shipmentFrequencyValue?: string
  onShipmentFrequencySelect?: (value: string) => void
}

const OptionSelectProductDropdowns = ({
  recipeOptions,
  recipeValue,
  onRecipeSelect,
  shipmentFrequencyOptions,
  shipmentFrequencyValue,
  onShipmentFrequencySelect,
}: OptionSelectProductDropdownsProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex flex-col gap-2 w-full md:flex-1">
        <label className="text-sm font-semibold text-secondary-900">
          {t('recipeLabel')}
        </label>
        <InputDropdown
          value={recipeValue}
          placeholder={t('recipePlaceholder')}
          options={recipeOptions}
          onSelect={onRecipeSelect}
        />
      </div>

      <div className="flex flex-col gap-2 w-full md:flex-1">
        <label className="text-sm font-semibold text-secondary-900">
          {t('shipmentFrequencyLabel')}
        </label>
        <InputDropdown
          value={shipmentFrequencyValue}
          placeholder={t('shipmentFrequencyPlaceholder')}
          options={shipmentFrequencyOptions}
          onSelect={onShipmentFrequencySelect}
        />
      </div>
    </div>
  )
}

export { OptionSelectProductDropdowns }
export type { OptionSelectProductDropdownsProps, DropdownOption }
