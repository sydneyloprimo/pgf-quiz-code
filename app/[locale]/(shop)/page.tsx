import { FeatureGrid } from '@/components/home/FeatureGrid'
import { GoldenMealsSection } from '@/components/home/GoldenMealsSection'
import { HeroSection } from '@/components/home/HeroSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <HeroSection />
      <GoldenMealsSection />
      <HowItWorksSection />
      <FeatureGrid />
    </main>
  )
}
