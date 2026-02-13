'use client'

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type RecipeType = 'turkey' | 'lamb' | 'seafood'

interface RecipesContextValue {
  activeRecipe: RecipeType
  setActiveRecipe: (recipe: RecipeType) => void
}

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined)

const RecipesProvider = ({ children }: PropsWithChildren) => {
  const [activeRecipe, setActiveRecipeState] = useState<RecipeType>('turkey')

  const setActiveRecipe = useCallback((recipe: RecipeType) => {
    setActiveRecipeState(recipe)
  }, [])

  const value = useMemo(
    () => ({
      activeRecipe,
      setActiveRecipe,
    }),
    [activeRecipe, setActiveRecipe]
  )

  return (
    <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
  )
}

const useRecipes = () => {
  const context = useContext(RecipesContext)
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider')
  }
  return context
}

export { RecipesProvider, useRecipes }
