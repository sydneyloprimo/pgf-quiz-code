'use client'
import cn from 'classnames'
import Image from 'next/image'
import React, { useState } from 'react'

import HamburgerMenu from './HamburgerMenu'

const images = {
  logoWhite: '/icons/logo-white.svg',
  cartIcon: '/icons/cart.svg',
  hamburgerIcon: 'hamburger icon',
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
        <button className="mx-2 outline outline-1 text-white rounded-md px-4 py-1">
          My Account
        </button>
        <button className="mx-2 flex outline outline-1 text-white rounded-md px-4 py-1">
          Shopping cart
          <Image
            className="ms-3"
            src={images.cartIcon}
            alt="shopping cart icon"
            width={16}
            height={14}
          />
        </button>
      </div>

      <div className="md:hidden">
        <button
          className="mx-2 outline outline-1 text-white rounded-md px-4 py-1"
          onClick={toggleMenu}
        >
          <Image
            src="/icons/hamburger.svg"
            alt={images.hamburgerIcon}
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
