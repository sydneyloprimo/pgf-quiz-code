import { BenefitsSection } from '@/components/home/BenefitsSection'
import { BostonAnnouncementSection } from '@/components/home/BostonAnnouncementSection'
import { ClinicallyApprovedSection } from '@/components/home/ClinicallyApprovedSection'
import { FAQSection } from '@/components/home/FAQSection'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { GoldenMealsSection } from '@/components/home/GoldenMealsSection'
import { HeroSection } from '@/components/home/HeroSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { VetNutritionistCTA } from '@/components/home/VetNutritionistCTA'

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <HeroSection />
      <GoldenMealsSection />
      <HowItWorksSection />
      <FeatureGrid />
      <BenefitsSection />
      <ClinicallyApprovedSection />
      <VetNutritionistCTA />
      <ReviewsSection />
      <FAQSection />
      <BostonAnnouncementSection />
    </main>
  )
}
