import { GoldenMealsSection } from '@/components/home/GoldenMealsSection'
import { HeroSection } from '@/components/home/HeroSection'

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <HeroSection />
      <GoldenMealsSection />
    </main>
  )
}
