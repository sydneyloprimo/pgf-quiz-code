'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Filters } from '@/hooks/useProductSearch'
import FilterIcon from 'public/icons/filter.svg'

import Category, { CategoryForm } from './Filters/Category'
import Condition, { ConditionForm } from './Filters/Condition'
import Price, { PriceForm } from './Filters/Price'

type FilterForm = ConditionForm & CategoryForm & PriceForm

interface FilterPanelProps {
  handleSetFilters: (filters: Filters) => void
}

const FilterPanel = ({ handleSetFilters }: FilterPanelProps) => {
  const t = useTranslations('Search.FilterPanel')
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  const defaultValues: FilterForm = useMemo(() => {
    const condition = searchParams.get('condition') || ''
    const priceMax = searchParams.get('priceMax') || ''
    const priceMin = searchParams.get('priceMin') || ''
    const category =
      searchParams
        .get('category')
        ?.split(',')
        .map((category) => ({ category, id: category } as Category)) || []

    return {
      category,
      condition,
      priceMax,
      priceMin,
    }
  }, [searchParams])

  const onSubmit = useCallback(
    (data: FilterForm) =>
      handleSetFilters({
        condition: data.condition,
        priceMax: data.priceMax,
        priceMin: data.priceMin,
        tags: data.category.map(({ category }) => category),
      }),
    [handleSetFilters]
  )

  const filterForm = useForm({ defaultValues })

  const category = filterForm.watch('category')

  useEffect(() => {
    const values = filterForm.getValues()
    handleSetFilters({
      condition: values.condition,
      priceMax: values.priceMax,
      priceMin: values.priceMin,
      tags: values.category.map(({ category }) => category),
    })
  }, [category, filterForm, handleSetFilters])

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

          <Category />
          <Price />

          <button
            className="btn-primary w-full mt-3 mb-5 h-[44px] w-fit"
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
