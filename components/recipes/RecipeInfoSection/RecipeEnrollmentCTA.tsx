'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { QUIZ_RETURN_PATH_KEY } from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { Routes } from '@/types/enums/routes'
import { getQuizStepPath } from '@/utils/quizRoutes'
import { safeSessionStorage } from '@/utils/safeSessionStorage'

const RecipeEnrollmentCTA = () => {
  const t = useTranslations('Recipes.EnrollmentCTA')
  const quizPath = getQuizStepPath(QuizStep.Welcome)

  return (
    <div className="mb-8 w-full rounded-none bg-quaternary-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-sans text-base leading-relaxed text-black">
          {t('sentence')}
        </p>
        <Button
          variant="tertiary"
          href={quizPath}
          className="shrink-0"
          onClick={() => {
            safeSessionStorage.setItem(QUIZ_RETURN_PATH_KEY, Routes.recipes)
          }}
        >
          {t('ctaButton')}
        </Button>
      </div>
    </div>
  )
}

export { RecipeEnrollmentCTA }
