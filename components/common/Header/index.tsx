'use client'

import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

import { Cookies } from '@/types/enums/cookies'
import { Routes } from '@/types/enums/routes'

import HamburgerMenu from './HamburgerMenu'

const images = {
  logoWhite: '/icons/logo-white.svg',
  chevronDown: '/icons/chevron-down.svg',
  cartIcon: '/icons/cart.svg',
  hamburgerIcon: '/icons/hamburger.svg',
}

const Header = () => {
  const [cookies] = useCookies([Cookies.customerAccessToken])
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Header')
  const router = useRouter()

  const toggleMenu = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  const onShoppingClick = () => {
    router.push(Routes.cart)
    toggleMenu()
  }

  const onAccountClick = () => {
    if (cookies[Cookies.customerAccessToken]) {
      toggleMenu()
    } else {
      router.push(Routes.signin)
    }
  }

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

      <div className="hidden md:flex">
        <button
          className="mx-2 btn-primary h-10 !text-sm"
          onClick={onAccountClick}
        >
          {t('myAccount')}
          <Image
            className="ms-3"
            src={images.chevronDown}
            alt=""
            width={16}
            height={14}
          />
        </button>
        <Link href={Routes.cart} className="mx-2 btn-primary h-10 !text-sm">
          {t('shoppingCart')}
          <Image
            className="ms-3"
            src={images.cartIcon}
            alt=""
            width={16}
            height={14}
          />
        </Link>
      </div>

      <div className="flex md:hidden">
        <button
          className="mx-2 btn-primary !rounded-sm h-8 !px-4"
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
          className="mx-2 btn-primary !rounded-sm h-8 !px-4"
          onClick={toggleMenu}
        >
          <Image
            alt={t('hamburgerIcon')}
            src={images.hamburgerIcon}
            width={24}
            height={24}
          />
        </button>
        {isOpen && (
          <HamburgerMenu
            handleAccountClick={onAccountClick}
            handleCartClick={onShoppingClick}
          />
        )}
      </div>
    </header>
  )
}

export default Header
