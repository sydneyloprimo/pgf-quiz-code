import { GallerySection } from '@/components/about/GallerySection'
import { HeroSection } from '@/components/about/HeroSection'
import { LeadershipSection } from '@/components/about/LeadershipSection'
import { ValuesSection } from '@/components/about/ValuesSection'

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <HeroSection />
      <ValuesSection />
      <LeadershipSection />
      <GallerySection />
    </main>
  )
}
