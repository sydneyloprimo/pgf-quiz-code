'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import readyToBuildPlanImage from 'public/images/recipes/ready-to-build-plan.png'

import { Button } from '@/components/common/Button'
import { Link } from '@/components/common/Link'
import { useConciergeContact } from '@/hooks/useConciergeContact'
import { QuizStep } from '@/types/enums/constants'
import { getQuizStepPath } from '@/utils/quizRoutes'


const ReadyToBuildYourPlanSection = () => {
  const t = useTranslations('Recipes.CTA')
  const tConcierge = useTranslations('Common.ConciergeLink')
  const quizPath = getQuizStepPath(QuizStep.Welcome)
  const { href: conciergeHref, isTabletOrLarger } = useConciergeContact()

  return (
    <section className="w-full bg-neutral-300 px-5 md:px-24 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative aspect-square max-w-md mx-auto lg:mx-0 w-full">
            <Image
              src={readyToBuildPlanImage}
              alt={t('ctaImageAlt')}
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-4xl font-normal leading-normal text-quaternary-800">
              {t('title')}
            </h2>
            <p className="font-sans text-base font-normal leading-normal text-black">
              {t('conciergeDescription')}
            </p>
            <Button variant="primary" href={quizPath} className="w-fit">
              {t('buildPlanButton')}
            </Button>
            <h3 className="font-display text-2xl font-normal leading-normal text-quaternary-800">
              {t('personalizedHeadline')}
            </h3>
            <p className="font-sans text-base font-normal leading-normal text-black">
              {t('personalizedDescription')}
            </p>
            <Link
              href={conciergeHref}
              variant="primary"
              className="w-fit"
              aria-label={
                isTabletOrLarger
                  ? tConcierge('emailAriaLabel')
                  : tConcierge('phoneAriaLabel')
              }
            >
              {isTabletOrLarger
                ? tConcierge('emailAriaLabel')
                : tConcierge('phoneAriaLabel')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export { ReadyToBuildYourPlanSection }
