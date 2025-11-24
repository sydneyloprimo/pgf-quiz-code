'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import BannerImage from 'public/images/banner.png'
import { useState } from 'react'

import { Button } from '@/components/common/Button'
import Input from '@/components/common/Input'
import { InputDropdown } from '@/components/common/InputDropdown'
import { InputNumber } from '@/components/common/InputNumber'
import { OptionSelect } from '@/components/common/OptionSelect'
import { RadioCheckbox } from '@/components/common/RadioCheckbox'
import { Routes } from '@/types/enums/routes'
import './styles.modules.css'

const HeroBanner = () => {
  const t = useTranslations('Home.HeroBanner')
  const [inputValue, setInputValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')
  const [radioValue, setRadioValue] = useState('option1')
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [numberValue, setNumberValue] = useState(3)

  return (
    <div
      className="w-full flex flex-col md:flex-row justify-end h-[500px] relative"
      style={{
        background:
          'linear-gradient(90deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 41.31%, rgba(0, 0, 0, 0.00) 57.44%, rgba(0, 0, 0, 0.33) 100%), #AEB2B9',
      }}
    >
      <div
        className="
        absolute
        top-0 left-0 bottom-0 
        flex flex-col items-center md:items-start
        md:m-auto h-min md:w-[700px] mx-12 mt-12 md:mx-32 
        text-center md:text-start
        z-banner"
      >
        <h4 className="text-base md:text-xl text-white ">{t('subtitle')}</h4>
        <h1 className="text-3xl md:text-4xl text-white font-bold">
          {t('title')}
        </h1>
        <Button
          variant="primary"
          href={Routes.products}
          className="w-max p-3 outline-dark-violet mt-4 z-banner"
          data-qa="hero-banner-button"
        >
          {t('button')}
        </Button>
        <Button
          variant="secondary"
          href={Routes.products}
          className="w-max p-3 outline-dark-violet mt-4 z-banner"
          data-qa="hero-banner-button"
        >
          {t('button')}
        </Button>
        <Button
          variant="tertiary"
          href={Routes.products}
          className="w-max p-3 outline-dark-violet mt-4 z-banner"
          data-qa="hero-banner-button"
          disabled={true}
        >
          {t('button')}
        </Button>

        <div className="flex flex-col gap-4 mt-8 w-full max-w-md">
          <Input
            label="Input Text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter text"
            prefix="R$"
            suffix="kg"
          />

          <OptionSelect state="default">Option Select</OptionSelect>

          <InputDropdown
            value={dropdownValue}
            placeholder="Select option"
            options={[
              { label: 'Option 1', value: 'option1', checked: true },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' },
            ]}
            onSelect={(value) => setDropdownValue(value)}
          />

          <RadioCheckbox
            type="radio"
            size="large"
            label="Radio Option 1"
            id="radio1"
            name="radio-group"
            checked={radioValue === 'option1'}
            onChange={(e) => setRadioValue('option1')}
          />
          <RadioCheckbox
            type="radio"
            size="large"
            label="Radio Option 2"
            id="radio2"
            name="radio-group"
            checked={radioValue === 'option2'}
            onChange={(e) => setRadioValue('option2')}
          />

          <RadioCheckbox
            type="checkbox"
            size="large"
            label="Checkbox Option"
            id="checkbox1"
            checked={checkboxChecked}
            onChange={(e) => setCheckboxChecked(e.target.checked)}
          />

          <InputNumber
            value={numberValue}
            onDecrement={() => setNumberValue((prev) => Math.max(0, prev - 1))}
            onIncrement={() => setNumberValue((prev) => prev + 1)}
          />
        </div>
      </div>
      <Image
        src={BannerImage}
        alt={t('alt')}
        className="banner-image object-contain md:object-cover"
      />
    </div>
  )
}

export default HeroBanner
