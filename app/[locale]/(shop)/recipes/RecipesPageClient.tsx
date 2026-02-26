'use client'

import {
  ReadyToBuildYourPlanSection,
  RecipeInfoSection,
  RecipeTabsSection,
  RecipesHeroSection,
  RecipesProvider,
} from '@/components/recipes'
import type { RecipeTablesMap } from '@/components/recipes/RecipesContext'
import { MAIN_CONTENT_ID } from '@/constants'

interface RecipesPageClientProps {
  tables: RecipeTablesMap
}

const RecipesPageClient = ({ tables }: RecipesPageClientProps) => {
  return (
    <RecipesProvider tables={tables}>
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex flex-col items-center w-full bg-neutral-300"
      >
        <RecipesHeroSection />
        <RecipeTabsSection />
        <RecipeInfoSection />
        <ReadyToBuildYourPlanSection />
      </main>
    </RecipesProvider>
  )
}

export { RecipesPageClient }
