'use client'

import cn from 'classnames'
import { useCombobox } from 'downshift'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import Input from '@/components/common/Input'
import { ProductType } from '@/components/products/ProductCatalog'

interface TypeFilterProps {
  productTypes: ProductType[]
  defaultSelectedProductType: string
}

const TypeFilter = ({
  productTypes,
  defaultSelectedProductType,
}: TypeFilterProps) => {
  const t = useTranslations('Search.FilterPanel')
  const [filteredProductTypes, setFilteredProductTypes] =
    useState<ProductType[]>(productTypes)

  const { isOpen, getMenuProps, getInputProps, getItemProps, selectedItem } =
    useCombobox({
      defaultInputValue: defaultSelectedProductType,
      itemToString: (item) => (item ? item?.name : ''),
      items: filteredProductTypes,
      onInputValueChange: ({ inputValue }) => {
        setFilteredProductTypes(
          productTypes.filter(
            (prodType) =>
              !inputValue ||
              prodType.name.toLowerCase().includes(inputValue.toLowerCase())
          )
        )
      },
    })

  const { register } = useFormContext()

  useEffect(() => {
    setFilteredProductTypes(productTypes)
  }, [productTypes, selectedItem])

  return (
    <fieldset>
      <div>
        <h5 className="font-bold my-2">{t('category')}</h5>
        <div>
          <Input
            {...getInputProps({ ...register('productType') })}
            inputClassName="h-[40px]"
            data-qa="product-type-input"
          />
        </div>
        <ul
          className={`absolute sm:w-full md:mr-8 md:w-[262px] bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
            !(isOpen && filteredProductTypes.length) && 'hidden'
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            filteredProductTypes.map((item, index) => (
              <li
                className={cn(
                  selectedItem === item && 'font-bold',
                  'py-2 px-3 shadow-sm flex flex-col hover:outline-offset-[-3px] hover:outline-none hover:bg-blue-200'
                )}
                key={item.name}
                {...getItemProps({ index, item })}
                data-qa="product-type-option"
              >
                <span>{item.name}</span>
              </li>
            ))}
        </ul>
      </div>
    </fieldset>
  )
}

export default TypeFilter
