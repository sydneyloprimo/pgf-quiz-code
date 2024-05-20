'use client'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useCallback, useState } from 'react'

import Input from '@/components/common/Input'
import { FilterParams } from '@/hooks/useProductSearch'
import { Routes } from '@/types/enums/routes'
import { buildQueryUrl } from '@/utils/utils'

import HeaderDropdownMenu from './HeaderDropdownMenu'

const images = {
  cartIcon: '/icons/cart.svg',
  chevronDown: '/icons/chevron-down.svg',
  hamburgerIcon: '/icons/hamburger.svg',
  logoWhite: '/icons/logo-white.svg',
}

const DEBOUNCE_WAIT_TIME = 800
const MINIMUM_SEARCH_LENGTH = 3

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(FilterParams.productTitle) ?? ''
  )
  const { push } = useRouter()
  const t = useTranslations('Header')

  const debouncedSearch = useCallback(
    debounce(
      (value: string) => {
        if (value.length >= MINIMUM_SEARCH_LENGTH || value.length === 0) {
          push(buildQueryUrl(Routes.products, { productTitle: value }))
        }
      },
      DEBOUNCE_WAIT_TIME,
      { trailing: true }
    ),
    []
  )

  const onDebounceSearch = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(value)
      debouncedSearch(value)
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
          <Link
            data-qa="header-shopping-cart-link"
            href={Routes.cart}
            className="btn-primary mx-2 !text-sm h-8 md:h-10 !rounded-sm md:!rounded-md flex gap-2"
          >
            <span className="hidden md:inline">{t('shoppingCart')}</span>
            <Image
              src={images.cartIcon}
              alt={t('cartIcon')}
              width={16}
              height={14}
            />
          </Link>
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
