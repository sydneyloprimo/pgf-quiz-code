import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { CommitmentSection } from '@/components/about/CommitmentSection'
import { CTASection } from '@/components/about/CTASection'
import { ExpertsSection } from '@/components/about/ExpertsSection'
import { GallerySection } from '@/components/about/GallerySection'
import { HeroSection } from '@/components/about/HeroSection'
import { LeadershipSection } from '@/components/about/LeadershipSection'
import { MissionSection } from '@/components/about/MissionSection'
import { ValuesSection } from '@/components/about/ValuesSection'
import { breadcrumbSchema, JsonLd } from '@/components/common/JsonLd'
import { SITE_URL } from '@/constants'
import { getExpertsSection } from '@/contentful/experts'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('About')
  return {
    title: t('Hero.title'),
    description: t('Hero.subtitle'),
    openGraph: {
      title: t('Hero.title'),
      description: t('Hero.subtitle'),
    },
  }
}

type AboutPageProps = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const expertsSectionContent = await getExpertsSection(locale)

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          {
            name: 'About',
            url: `${SITE_URL}/about`,
          },
        ])}
      />
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
