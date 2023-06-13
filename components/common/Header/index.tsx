'use client'

import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { Routes } from '@/types/enums/routes'

import HeaderDropdownMenu from './HeaderDropdownMenu'

const images = {
  logoWhite: '/icons/logo-white.svg',
  chevronDown: '/icons/chevron-down.svg',
  cartIcon: '/icons/cart.svg',
  hamburgerIcon: '/icons/hamburger.svg',
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Header')

  return (
    <header
      className={cn(
        'flex items-center justify-between px-5 md:px-[119px] py-5 bg-black container h-14 md:h-24 min-w-full'
      )}
    >
      <div>
        <Link href={Routes.home}>
          <Image
            className="hidden md:block"
            src={images.logoWhite}
            alt={t('logoDesktop')}
            width={192}
            height={34}
          />
          <Image
            src={images.logoWhite}
            className="md:hidden"
            alt={t('logoMobile')}
            height={19}
            width={112}
          />
        </Link>
      </div>

      <div className="flex md:flex-row-reverse">
        <Link
          href={Routes.cart}
          className="btn-primary mx-2 !text-sm h-8 md:h-10 !rounded-sm md:!rounded-md flex gap-2"
        >
          <span className="hidden md:inline">{t('shoppingCart')}</span>
          <Image src={images.cartIcon} alt="" width={16} height={14} />
        </Link>
        <HeaderDropdownMenu isOpen={isOpen} onMenuChange={setIsOpen} />
      </div>
    </header>
  )
}

export default Header
