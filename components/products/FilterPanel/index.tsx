'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ProductType } from '@/components/products/ProductCatalog'
import { FilterParams, Filters } from '@/hooks/useProductSearch'
import FilterIcon from 'public/icons/filter.svg'

import Condition, { ConditionForm } from './Filters/Condition'
import Price, { PriceForm } from './Filters/Price'
import TypeFilter from './Filters/Type'

type FilterForm = ConditionForm & PriceForm & { productType: string }

interface FilterPanelProps {
  onFiltersChange: (filters: Filters) => void
  productTypes: ProductType[]
}

const FilterPanel = ({ onFiltersChange, productTypes }: FilterPanelProps) => {
  const t = useTranslations('Search.FilterPanel')
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  const defaultValues: FilterForm = useMemo(() => {
    const condition = searchParams.get(FilterParams.condition) || ''
    const priceMax = searchParams.get(FilterParams.priceMax) || ''
    const priceMin = searchParams.get(FilterParams.priceMin) || ''
    const productType = searchParams.get(FilterParams.productType) || ''

    return {
      condition,
      priceMax,
      priceMin,
      productType,
    }
  }, [searchParams])

  const filterForm = useForm({ defaultValues })

  const onSubmit = useCallback(
    (data: FilterForm) => {
      const isProductTypeValid = productTypes.some(
        (prodType) => prodType.name === data.productType
      )
      return onFiltersChange({
        condition: data.condition,
        priceMax: data.priceMax,
        priceMin: data.priceMin,
        productType: isProductTypeValid ? data.productType : '',
      })
    },
    [onFiltersChange, productTypes]
  )

  return (
    <div>
      <div className="flex-initial mb-4 flex justify-between md:hidden">
        <p className="text-sm">{t('title')}</p>
        <button
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          className="active:opacity-80"
        >
          <Image src={FilterIcon} alt={t('buttonAlt')} />
        </button>
      </div>

      <FormProvider {...filterForm}>
        <form
          onSubmit={filterForm.handleSubmit(onSubmit)}
          className={`${
            isOpen ? 'max-h-screen' : 'max-h-0'
          } md:max-h-screen transition-all duration-500 ease flex flex-col md:mr-8 md:w-[262px] overflow-hidden`}
        >
          <h3 className="text-2xl text-bold">{t('filters')}</h3>
          <Condition />

          <TypeFilter
            productTypes={productTypes}
            defaultSelectedProductType={defaultValues.productType}
          />
          <Price />

          <button
            className="btn-primary w-full mt-3 mb-5 h-[44px]"
            type="submit"
          >
            {t('seeResults')}
            <Image
              src={'/icons/arrow-right.svg'}
              className="ml-3"
              alt=""
              width={24}
              height={24}
            />
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export default FilterPanel
