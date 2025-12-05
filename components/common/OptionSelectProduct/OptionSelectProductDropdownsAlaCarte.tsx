'use client'

import { useTranslations } from 'next-intl'

import { InputDropdown } from '@/components/common/InputDropdown'

interface DropdownOption {
  label: string
  value: string
}

interface OptionSelectProductDropdownsAlaCarteProps {
  recipeOptions: DropdownOption[]
  recipeValue?: string
  onRecipeSelect?: (value: string) => void
}

const OptionSelectProductDropdownsAlaCarte = ({
  recipeOptions,
  recipeValue,
  onRecipeSelect,
}: OptionSelectProductDropdownsAlaCarteProps) => {
  const t = useTranslations('Common.OptionSelectProduct')

  return (
    <div className="flex flex-col gap-2">
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
  )
}

export { OptionSelectProductDropdownsAlaCarte }
export type {
  OptionSelectProductDropdownsAlaCarteProps,
  DropdownOption as DropdownOptionAlaCarte,
}
