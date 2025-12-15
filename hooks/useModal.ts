import { useCallback, useState } from 'react'

interface UseModalReturn {
  isOpen: boolean
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
}

export const useModal = (initialState = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState)

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    toggleModal,
    openModal,
    closeModal,
  }
}
