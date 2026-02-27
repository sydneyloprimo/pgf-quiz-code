'use client'

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'

interface QuizDropdownContextType {
  isDropdownOpen: boolean
  setDropdownOpen: (open: boolean) => void
}

const QuizDropdownContext = createContext<QuizDropdownContextType | undefined>(
  undefined
)

interface QuizDropdownProviderProps extends PropsWithChildren {}

const QuizDropdownProvider = ({ children }: QuizDropdownProviderProps) => {
  const [openCount, setOpenCount] = useState(0)
  const isDropdownOpen = openCount > 0

  const setDropdownOpen = useCallback((open: boolean) => {
    setOpenCount((prev) => Math.max(0, prev + (open ? 1 : -1)))
  }, [])

  return (
    <QuizDropdownContext.Provider value={{ isDropdownOpen, setDropdownOpen }}>
      {children}
    </QuizDropdownContext.Provider>
  )
}

const useQuizDropdownContext = () => {
  const context = useContext(QuizDropdownContext)
  return context
}

export { QuizDropdownProvider, useQuizDropdownContext }
