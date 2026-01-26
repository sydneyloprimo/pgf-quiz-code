'use client'

import { useCallback, useState } from 'react'

const useShoppingCartPanel = () => {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    openCart,
    closeCart,
  }
}

export default useShoppingCartPanel
