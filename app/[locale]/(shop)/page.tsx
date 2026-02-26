import { getTranslations } from 'next-intl/server'

import { breadcrumbSchema, faqSchema, JsonLd } from '@/components/common/JsonLd'
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
import { FAQS_DATA, MAIN_CONTENT_ID, SITE_URL } from '@/constants'

export default async function Home() {
  const t = await getTranslations('Home.FAQ')

  const faqItems = FAQS_DATA.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }))

  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="flex flex-col items-center w-full bg-neutral-300"
    >
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: SITE_URL }])} />
      <JsonLd data={faqSchema(faqItems)} />
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
