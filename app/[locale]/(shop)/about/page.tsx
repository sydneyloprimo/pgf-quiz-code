import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CommitmentSection } from '@/components/about/CommitmentSection'
import { CTASection } from '@/components/about/CTASection'
import { ExpertsSection } from '@/components/about/ExpertsSection'
import { GallerySection } from '@/components/about/GallerySection'
import { HeroSection } from '@/components/about/HeroSection'
import { LeadershipSection } from '@/components/about/LeadershipSection'
import { MissionSection } from '@/components/about/MissionSection'
import { ValuesSection } from '@/components/about/ValuesSection'
import { breadcrumbSchema, JsonLd } from '@/components/common/JsonLd'
import { MAIN_CONTENT_ID, SITE_URL } from '@/constants'
import { getExpertsSection } from '@/contentful/experts'
import { Locale } from '@/i18n'

type AboutPageMetadataProps = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({
  params,
}: AboutPageMetadataProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
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
  params: Promise<{ locale: Locale }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const expertsSectionContent = await getExpertsSection(locale)

  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="flex flex-col items-center w-full bg-neutral-300"
    >
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
