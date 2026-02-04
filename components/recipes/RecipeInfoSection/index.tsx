'use client'

import { RecipeHeading } from './RecipeHeading'
import { RecipeThreeInfo } from './RecipeThreeInfo'

const RecipeInfoSection = () => {
  return (
    <section className="w-full bg-neutral-100 px-4 py-12 lg:px-24">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black px-4 py-12 lg:px-20">
        <RecipeHeading />
        <RecipeThreeInfo />
      </div>
    </section>
  )
}

export { RecipeInfoSection }
export * from './RecipeHeading'
export * from './RecipeThreeInfo'
