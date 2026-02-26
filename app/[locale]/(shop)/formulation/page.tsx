import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { breadcrumbSchema, faqSchema, JsonLd } from '@/components/common/JsonLd'
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
import { FAQ_ITEMS, SITE_URL } from '@/constants'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Formulation')
  return {
    title: t('Hero.title'),
    description: t('Hero.subtitle'),
    openGraph: {
      title: t('Hero.title'),
      description: t('Hero.subtitle'),
    },
  }
}

export default async function FormulationPage() {
  const t = await getTranslations('Formulation.FAQ')

  const faqItems = FAQ_ITEMS.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }))

  return (
    <main className="flex flex-col items-center w-full bg-neutral-300">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          {
            name: 'Formulation',
            url: `${SITE_URL}/formulation`,
          },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />
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
