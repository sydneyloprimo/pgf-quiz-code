import { CommitmentSection } from '@/components/about/CommitmentSection'
import { CTASection } from '@/components/about/CTASection'
import { ExpertsSection } from '@/components/about/ExpertsSection'
import { GallerySection } from '@/components/about/GallerySection'
import { HeroSection } from '@/components/about/HeroSection'
import { LeadershipSection } from '@/components/about/LeadershipSection'
import { MissionSection } from '@/components/about/MissionSection'
import { ValuesSection } from '@/components/about/ValuesSection'
import { getExpertsSection } from '@/contentful/experts'

type AboutPageProps = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const expertsSectionContent = await getExpertsSection(locale)

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <HeroSection />
      <ValuesSection />
      <LeadershipSection />
      <GallerySection />
      <MissionSection />
      <CommitmentSection />
      <ExpertsSection content={expertsSectionContent} />
      <CTASection />
    </main>
  )
}
