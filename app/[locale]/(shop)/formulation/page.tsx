import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

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
import { FAQ_ITEMS, MAIN_CONTENT_ID, SITE_URL } from '@/constants'
import { Locale } from '@/i18n'

type FormulationPageMetadataProps = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({
  params,
}: FormulationPageMetadataProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
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

type FormulationPageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function FormulationPage({
  params,
}: FormulationPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Formulation.FAQ')

  const faqItems = FAQ_ITEMS.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }))

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
