import { getTranslations, setRequestLocale } from 'next-intl/server'

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
import {
  FAQS_DATA,
  FEATURE_FLAG_REVIEWS,
  MAIN_CONTENT_ID,
  SITE_URL,
} from '@/constants'
import { getFeatureFlag } from '@/contentful/featureFlags'
import { getCustomerReviews } from '@/contentful/reviews'
import { Locale } from '@/i18n'

type HomePageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home.FAQ')

  const faqItems = FAQS_DATA.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }))

  const [reviewsEnabled, reviews] = await Promise.all([
    getFeatureFlag(FEATURE_FLAG_REVIEWS),
    getCustomerReviews(),
  ])

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
      {reviewsEnabled && reviews.length > 0 && (
        <ReviewsSection reviews={reviews} />
      )}
      <FAQSection />
      <BostonAnnouncementSection />
    </main>
  )
}
