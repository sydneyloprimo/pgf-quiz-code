'use client'

import { RecipeAAFCOStatement } from './RecipeAAFCOStatement'
import { RecipeDetails } from './RecipeDetails'
import { RecipeEnrollmentCTA } from './RecipeEnrollmentCTA'
import { RecipeFormulationLogic } from './RecipeFormulationLogic'
import { RecipeGuaranteedAnalysis } from './RecipeGuaranteedAnalysis'
import { RecipeHeading } from './RecipeHeading'
import { RecipeNutritionPanel } from './RecipeNutritionPanel'
import { RecipeServingStorage } from './RecipeServingStorage'

const RecipeInfoSection = () => {
  return (
    <section className="w-full bg-neutral-100 px-4 py-12 lg:px-24">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black px-4 py-12 lg:px-20">
        <RecipeHeading />
        <RecipeDetails />
        <RecipeEnrollmentCTA />
        <RecipeGuaranteedAnalysis />
        <RecipeNutritionPanel />
        <RecipeFormulationLogic />
        <RecipeAAFCOStatement />
        <RecipeServingStorage />
      </div>
    </section>
  )
}

export { RecipeInfoSection }
export * from './RecipeDetails'
export * from './RecipeEnrollmentCTA'
export * from './RecipeHeading'
export * from './RecipeGuaranteedAnalysis'
export * from './RecipeNutritionPanel'
export * from './RecipeFormulationLogic'
export * from './RecipeAAFCOStatement'
export * from './RecipeServingStorage'
