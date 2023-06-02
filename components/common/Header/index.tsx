'use client'

import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import HamburgerMenu from './HamburgerMenu'

const images = {
  logoWhite: '/icons/logo-white.svg',
  chevronDown: '/icons/chevron-down.svg',
  cartIcon: '/icons/cart.svg',
  hamburgerIcon: '/icons/hamburger.svg',
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Header')

  const toggleMenu = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  return (
    <header
      className={cn(
        'flex items-center justify-between px-5 md:px-0 py-5 bg-black container h-14 md:h-24'
      )}
    >
      <div>
        <Link href="/">
          <Image
            className="hidden md:block"
            src={images.logoWhite}
            alt={t('logoDesktop')}
            width={192}
            height={34}
          />
          <Image
            className="md:hidden"
            src={images.logoWhite}
            alt={t('logoMobile')}
            width={112}
            height={19}
          />
        </Link>
      </div>

      <div className="hidden md:flex">
        <button className="mx-2 btn-primary !text-sm">
          {t('myAccount')}
          <Image
            className="ms-3"
            src={images.chevronDown}
            alt=""
            width={16}
            height={14}
          />
        </button>
        <button className="ml-2 btn-primary !text-sm">
          {t('shoppingCart')}
          <Image
            className="ms-3"
            src={images.cartIcon}
            alt=""
            width={16}
            height={14}
          />
        </button>
      </div>

      <div className="flex md:hidden">
        <button
          className="mx-2 btn-primary !rounded-sm !h-8 !px-4"
          onClick={toggleMenu}
        >
          <Image
            className="mr-1"
            src={images.cartIcon}
            alt={t('cartIcon')}
            width={24}
            height={24}
          />
        </button>
        <button
          className="ml-2 btn-primary !rounded-sm !h-8 !px-4"
          onClick={toggleMenu}
        >
          <Image
            alt={t('hamburgerIcon')}
            src={images.hamburgerIcon}
            width={24}
            height={24}
          />
        </button>
        {isOpen && <HamburgerMenu closeMenu={toggleMenu} />}
      </div>
    </header>
  )
}

export default Header
