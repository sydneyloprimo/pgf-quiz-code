import React from 'react'

interface HamburgerMenuProps {
  handleCartClick: () => void
  handleAccountClick: () => void
}

const HamburgerMenu = ({
  handleCartClick,
  handleAccountClick,
}: HamburgerMenuProps) => (
  <div className="absolute z-hamburguer-menu flex flex-col top-0 right-0 mt-10 mr-2 w-48 bg-white rounded-md shadow-lg py-1">
    <button
      onClick={handleCartClick}
      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
    >
      Shopping Cart
    </button>
    <button
      onClick={handleAccountClick}
      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
    >
      My Account
    </button>
  </div>
)

export default HamburgerMenu
