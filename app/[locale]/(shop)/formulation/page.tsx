import {
  ClinicalResearchSection,
  DiscoverPlansSection,
  FAQSection,
  FormulationHeroSection,
  IngredientLibrarySection,
  IntroductionSection,
  OurStandardsSection,
  PrecisionBatchSection,
} from '@/components/formulation'

export default function FormulationPage() {
  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <FormulationHeroSection />
      <IntroductionSection />
      <OurStandardsSection />
      <PrecisionBatchSection />
      <ClinicalResearchSection />
      <FAQSection />
      <IngredientLibrarySection />
      <DiscoverPlansSection />
    </main>
  )
}
