'use client'

import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { ProductConditions } from '@/types/enums/constants'

export interface ConditionForm {
  condition: string
}

const OPTIONS = [
  ProductConditions.New,
  ProductConditions.Used,
  ProductConditions.Refurbished,
]

const classes = {
  new: {
    input: 'peer/new',
    label: 'text-gray-500 peer-checked/new:text-dark-violet',
  },
  refurbished: {
    input: 'peer/refurbished',
    label: 'text-gray-500 peer-checked/refurbished:text-dark-violet',
  },
  used: {
    input: 'peer/used',
    label: 'text-gray-500 peer-checked/used:text-dark-violet',
  },
} as const

const Condition = () => {
  const t = useTranslations('Search.FilterPanel')
  const { register } = useFormContext()

  return (
    <fieldset>
      <h5 className="font-bold my-2">{t('condition')}</h5>
      {OPTIONS.map((option) => (
        <div className="my-2" key={option}>
          <input
            id={option}
            className={`mx-2 accent-dark-violet ${classes[option].input}`}
            type="radio"
            value={option}
            {...register('condition')}
          />
          <label
            htmlFor={option}
            className={classes[option].label}
            key={option}
          >
            {t(option)}
          </label>
        </div>
      ))}
    </fieldset>
  )
}

export default Condition
