'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import readyToBuildPlanImage from 'public/images/recipes/ready-to-build-plan.png'

import { Button } from '@/components/common/Button'
import { QuizStep } from '@/types/enums/constants'
import { getQuizStepPath } from '@/utils/quizRoutes'

const ReadyToBuildYourPlanSection = () => {
  const t = useTranslations('Recipes.CTA')
  const quizPath = getQuizStepPath(QuizStep.Welcome)

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
              {t('description')}
            </p>
            <Button variant="primary" href={quizPath} className="w-fit">
              {t('ctaButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { ReadyToBuildYourPlanSection }
