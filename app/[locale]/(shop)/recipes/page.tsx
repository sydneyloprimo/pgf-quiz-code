'use client'

import { RecipesHeroSection, RecipesProvider } from '@/components/recipes'

export default function RecipesPage() {
  return (
    <RecipesProvider>
      <main className="flex flex-col items-center w-full bg-[#F3F0ED]">
        <RecipesHeroSection />
      </main>
    </RecipesProvider>
  )
}
