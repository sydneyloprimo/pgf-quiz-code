'use client'

import {
  ReadyToBuildYourPlanSection,
  RecipeInfoSection,
  RecipeTabsSection,
  RecipesHeroSection,
  RecipesProvider,
} from '@/components/recipes'
import { MAIN_CONTENT_ID } from '@/constants'

export default function RecipesPage() {
  return (
    <RecipesProvider>
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
