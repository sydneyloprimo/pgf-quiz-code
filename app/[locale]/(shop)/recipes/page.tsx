'use client'

import {
  ReadyToBuildYourPlanSection,
  RecipeInfoSection,
  RecipeTabsSection,
  RecipesHeroSection,
  RecipesProvider,
} from '@/components/recipes'

export default function RecipesPage() {
  return (
    <RecipesProvider>
      <main className="flex flex-col items-center w-full bg-neutral-300">
        <RecipesHeroSection />
        <RecipeTabsSection />
        <RecipeInfoSection />
        <ReadyToBuildYourPlanSection />
      </main>
    </RecipesProvider>
  )
}
