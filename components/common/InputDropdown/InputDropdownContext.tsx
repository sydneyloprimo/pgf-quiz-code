'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

interface InputDropdownContextType {
  toggleDropdown: (id: string) => void
  isOpen: (id: string) => boolean
}

const InputDropdownContext = createContext<
  InputDropdownContextType | undefined
>(undefined)

interface InputDropdownProviderProps {
  children: ReactNode
}

const InputDropdownProvider = ({ children }: InputDropdownProviderProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const toggleDropdown = useCallback((id: string) => {
    setOpenDropdownId((prevState) => (prevState === id ? null : id))
  }, [])

  const isOpen = useCallback(
    (id: string) => {
      return openDropdownId === id
    },
    [openDropdownId]
  )

  return (
    <InputDropdownContext.Provider value={{ toggleDropdown, isOpen }}>
      {children}
    </InputDropdownContext.Provider>
  )
}

const useInputDropdownContext = () => {
  const context = useContext(InputDropdownContext)
  if (context === undefined) {
    throw new Error(
      'useInputDropdownContext must be used within InputDropdownProvider'
    )
  }
  return context
}

export { InputDropdownProvider, useInputDropdownContext }
