'use client'

import { useTranslations } from 'next-intl'

import { InputDropdown } from '@/components/common/InputDropdown'
import { InputDropdownProvider } from '@/components/common/InputDropdown/InputDropdownContext'
import { InputDropdownState } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface ProductDetailInfoProps {
  selectedRecipe: string
  recipeOptions: Array<{ label: string; value: string }>
  onRecipeSelect: (value: string) => void
  description: string
  price: string
}

const ProductDetailInfo = ({
  selectedRecipe,
  recipeOptions,
  onRecipeSelect,
  description,
  price,
}: ProductDetailInfoProps) => {
  const t = useTranslations('Common.ProductDetailPanel')

  return (
    <div className="flex flex-col gap-5 items-start w-full">
      <div className="flex flex-col items-start w-full">
        <InputDropdownProvider>
          <InputDropdown
            value={selectedRecipe}
            options={recipeOptions}
            onSelect={onRecipeSelect}
            className="w-full"
            state={InputDropdownState.Filled}
          />
        </InputDropdownProvider>
      </div>
      <p
        className={cn(
          'font-sans font-normal leading-6 text-base',
          'text-neutral-950 w-full',
          'whitespace-pre-wrap'
        )}
      >
        {description}
      </p>
      <div className="flex flex-col gap-2 items-start leading-6 w-full whitespace-pre-wrap">
        <p className="font-sans font-normal text-base text-neutral-950 w-full">
          {t('priceLabel')}
        </p>
        <p className="font-sans font-bold text-xl text-neutral-950 w-full">
          {price}
        </p>
      </div>
    </div>
  )
}

export { ProductDetailInfo }
export type { ProductDetailInfoProps }
