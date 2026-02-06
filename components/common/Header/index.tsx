'use client'
import debounce from 'lodash/debounce'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useCallback, useState } from 'react'

import HeaderDropdownMenu from './HeaderDropdownMenu'

import Input from '@/components/common/Input'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

const images = {
  cartIcon: '/icons/cart.svg',
  chevronDown: '/icons/chevron-down.svg',
  hamburgerIcon: '/icons/hamburger.svg',
  logoWhite: '/icons/logo-white.svg',
}

const DEBOUNCE_WAIT_TIME = 800

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const t = useTranslations('Header')

  const debouncedSearch = useCallback(
    debounce(
      () => {
        // Search / products route removed; no-op
      },
      DEBOUNCE_WAIT_TIME,
      { trailing: true }
    ),
    []
  )

  const onDebounceSearch = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(value)
      debouncedSearch()
    },
    [setSearchTerm, debouncedSearch]
  )

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between px-5 md:px-[119px] py-5 bg-black container h-14 md:h-24 min-w-full'
        )}
      >
        <div>
          <Link href={Routes.home} data-qa="home-logo">
            <Image
              className="hidden md:block"
              src={images.logoWhite}
              alt={t('logoDesktop')}
              width={192}
              height={34}
              priority
            />
            <Image
              src={images.logoWhite}
              className="md:hidden"
              alt={t('logoMobile')}
              height={19}
              width={112}
              priority
            />
          </Link>
        </div>

        <Input
          data-qa="header-search-input"
          onChange={onDebounceSearch}
          className="hidden md:block lg:w-1/3 text-black"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
        />

        <div className="flex md:flex-row-reverse">
          <span
            data-qa="header-shopping-cart"
            className="btn-primary mx-2 !text-sm h-8 md:h-10 !rounded-sm md:!rounded-md flex gap-2 cursor-default"
          >
            <span className="hidden md:inline">{t('shoppingCart')}</span>
            <Image
              src={images.cartIcon}
              alt={t('cartIcon')}
              width={16}
              height={14}
            />
          </span>
          <HeaderDropdownMenu isOpen={isOpen} onMenuChange={setIsOpen} />
        </div>
      </header>

      <Input
        data-qa="header-search-input"
        onChange={onDebounceSearch}
        className="md:hidden w-full px-4 my-3 text-black"
        inputClassName="border-0"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
      />
    </>
  )
}

export default Header
