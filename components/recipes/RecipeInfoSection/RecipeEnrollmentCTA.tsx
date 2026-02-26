'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { QuizStep } from '@/types/enums/constants'
import { getQuizStepPath } from '@/utils/quizRoutes'

const RecipeEnrollmentCTA = () => {
  const t = useTranslations('Recipes.EnrollmentCTA')
  const quizPath = getQuizStepPath(QuizStep.Welcome)

  return (
    <div className="mb-8 w-1/2 rounded-none bg-quaternary-200 p-6">
      <div className="flex flex-col gap-4">
        <p className="font-sans text-base leading-relaxed text-neutral-950">
          {t('sentence')}
        </p>
        <Button variant="tertiary" href={quizPath} className="w-fit">
          {t('ctaButton')}
        </Button>
      </div>
    </div>
  )
}

export { RecipeEnrollmentCTA }
