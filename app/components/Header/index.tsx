'use client'
import cn from 'classnames'
import Image from 'next/image'
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

  const toggleMenu = () => {
    setIsOpen((isOpen) => !isOpen)
  }

  return (
    <header
      className={cn(
        'flex items-center justify-between p-5 bg-black container h-14 md:h-24'
      )}
    >
      <div>
        <Image
          className="hidden md:block"
          src={images.logoWhite}
          alt="Logo desktop"
          width={192}
          height={34}
        />
        <Image
          className="md:hidden"
          src={images.logoWhite}
          alt="Logo mobile"
          width={112}
          height={19}
        />
      </div>

      <div className="hidden md:flex">
        <button className="mx-2 text-sm h-10 outline outline-1 text-white rounded-md px-5 flex items-center">
          My Account
          <Image
            className="ms-3"
            src={images.chevronDown}
            alt=""
            width={16}
            height={14}
          />
        </button>
        <button className="mx-2 text-sm h-10 flex outline outline-1 text-white rounded-md px-5 flex items-center">
          Shopping cart
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
          className="mx-2 outline outline-1 text-white rounded-sm h-8 px-4"
          onClick={toggleMenu}
        >
          <Image
            className="mr-1"
            src={images.cartIcon}
            alt="cart icon"
            width={24}
            height={24}
          />
        </button>
        <button
          className="mx-2 outline outline-1 text-white rounded-sm h-8 px-4"
          onClick={toggleMenu}
        >
          <Image
            alt="hamburger icon"
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
