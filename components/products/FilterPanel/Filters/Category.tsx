'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import Input from '@/components/common/Input'
import CrossIcon from 'public/icons/cross.svg'

interface Category {
  category: string
  id: string
}
export interface CategoryForm {
  category: Category[]
}

const Category = () => {
  const t = useTranslations('Search.FilterPanel')
  const { control, watch } = useFormContext()
  const [categoryInput, setCategoryInput] = useState('')

  const categoryArray = useFieldArray({
    control,
    name: 'category',
  })

  const categories: CategoryForm['category'] = watch('category')

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      categoryArray.append({ category: categoryInput })
      setCategoryInput('')
    },
    [categoryArray, categoryInput]
  )

  const handleDeleteCategory = useCallback(
    (id: string) => {
      const categories: CategoryForm['category'] = watch('category')

      categoryArray.remove(
        categories.findIndex((category) => category.id === id)
      )
    },
    [categoryArray, watch]
  )

  return (
    <fieldset>
      <h5 className="font-bold my-2">{t('category')}</h5>

      <Input
        inputClassName="h-[40px] "
        label
        onKeyDown={onKeyDown}
        className="mb-3"
        type="text"
        value={categoryInput}
        onChange={(event) => setCategoryInput(event.target.value)}
      />

      {categories.map(({ category, id }) => (
        <div className="m-2 inline" key={category}>
          {category}
          <Image
            className="ml-2 h-3 w-3 inline cursor-pointer"
            src={CrossIcon}
            onClick={() => handleDeleteCategory(id)}
            alt=""
          />
        </div>
      ))}
    </fieldset>
  )
}

export default Category
