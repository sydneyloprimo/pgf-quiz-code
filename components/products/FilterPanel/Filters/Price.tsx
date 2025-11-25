'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import Input from '@/components/common/Input'

export interface PriceForm {
  priceMin: string
  priceMax: string
}

const Price = () => {
  const t = useTranslations('Search.FilterPanel')
  const { register } = useFormContext()

  return (
    <fieldset className="my-3">
      <h5 className="font-bold my-2">{t('price')}</h5>

      <Input
        label={t('min')}
        placeholder={t('typeMin')}
        type="text"
        className="mb-3"
        inputClassName="h-10"
        labelClassName="my-2"
        {...register('priceMin')}
        data-qa="min-price-input"
      />
      <Input
        label={t('max')}
        placeholder={t('typeMax')}
        type="text"
        className="mb-3"
        inputClassName="h-10"
        labelClassName="my-2"
        {...register('priceMax')}
        data-qa="max-price-input"
      />
    </fieldset>
  )
}

export default Price
