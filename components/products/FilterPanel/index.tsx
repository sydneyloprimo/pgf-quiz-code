'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import FilterIcon from 'public/icons/filter.svg'

import Category, { CategoryForm } from './Filters/Category'
import Condition, { ConditionForm } from './Filters/Condition'
import Price, { PriceForm } from './Filters/Price'

type FilterForm = ConditionForm & CategoryForm & PriceForm

const defaultValues: FilterForm = {
  category: [],
  condition: '',
  maxPrice: '',
  minPrice: '',
}

const FilterPanel = () => {
  const t = useTranslations('Search.FilterPanel')
  const [isOpen, setIsOpen] = useState(false)

  const onSubmit = (data: FilterForm) => {
    console.log(data)
  }

  const methods = useForm({ defaultValues })

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

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
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
