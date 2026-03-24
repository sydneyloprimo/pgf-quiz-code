'use client'

import type { Document } from '@contentful/rich-text-types'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { RECIPE_TABS } from '@/constants'

export type RecipeType = 'turkey' | 'lamb' | 'seafood'

export interface RecipeTableData {
  guaranteedAnalysis: Document | null
  minerals: Document | null
  vitamins: Document | null
  fats: Document | null
  aminoAcids: Document | null
}

export type RecipeTablesMap = Record<string, RecipeTableData>

interface RecipesContextValue {
  activeRecipe: RecipeType
  setActiveRecipe: (recipe: RecipeType) => void
  tables: RecipeTablesMap
}

interface RecipesProviderProps extends PropsWithChildren {
  tables?: RecipeTablesMap
}

const EMPTY_TABLE_DATA: RecipeTableData = {
  guaranteedAnalysis: null,
  minerals: null,
  vitamins: null,
  fats: null,
  aminoAcids: null,
}

const EMPTY_TABLES: RecipeTablesMap = {
  turkey: { ...EMPTY_TABLE_DATA },
  lamb: { ...EMPTY_TABLE_DATA },
  seafood: { ...EMPTY_TABLE_DATA },
}

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined)

const RecipesProvider = ({
  children,
  tables = EMPTY_TABLES,
}: RecipesProviderProps) => {
  const [activeRecipe, setActiveRecipeState] = useState<RecipeType>('turkey')

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && RECIPE_TABS.includes(hash as RecipeType)) {
      setActiveRecipeState(hash as RecipeType)
    }
  }, [])

  const setActiveRecipe = useCallback((recipe: RecipeType) => {
    setActiveRecipeState(recipe)
  }, [])

  const value = useMemo(
    () => ({
      activeRecipe,
      setActiveRecipe,
      tables,
    }),
    [activeRecipe, setActiveRecipe, tables]
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
