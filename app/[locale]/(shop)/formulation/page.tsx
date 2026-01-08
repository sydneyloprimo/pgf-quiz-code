import {
  ClinicalResearchSection,
  FormulationHeroSection,
  IntroductionSection,
  OurStandardsSection,
} from '@/components/formulation'

export default function FormulationPage() {
  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <FormulationHeroSection />
      <IntroductionSection />
      <OurStandardsSection />
      <ClinicalResearchSection />
    </main>
  )
}
