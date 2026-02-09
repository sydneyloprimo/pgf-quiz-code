'use client'

import { RecipeDetails } from './RecipeDetails'
import { RecipeHeading } from './RecipeHeading'

const RecipeInfoSection = () => {
  return (
    <section className="w-full bg-neutral-100 px-4 py-12 lg:px-24">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black px-4 py-12 lg:px-20">
        <RecipeHeading />
        <RecipeDetails />
      </div>
    </section>
  )
}

export { RecipeInfoSection }
export * from './RecipeDetails'
export * from './RecipeHeading'
