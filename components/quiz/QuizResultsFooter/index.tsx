'use client'

import { useTranslations } from 'next-intl'

import {
  AlertSuccessIcon,
  Garlic1Icon,
  Garlic2Icon,
} from '@/components/common/Icon'
import { Link } from '@/components/common/Link'
import { clearFormData } from '@/components/quiz/helpers'
import { QUIZ_RESULTS_FOOTER_BENEFITS } from '@/constants'
import { QuizStep } from '@/types/enums/constants'
import { getQuizStepPath } from '@/utils/quizRoutes'

interface QuizResultsFooterProps {
  dogName: string
}

const QuizResultsFooter = ({ dogName }: QuizResultsFooterProps) => {
  const t = useTranslations('Quiz.results.footer')

  const handleQuizAgainClick = () => {
    clearFormData()
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 px-5">
      <div className="w-full flex items-center gap-6">
        <div className="flex-1 h-px bg-tertiary-300" />
        <Garlic1Icon
          className="size-16 text-tertiary-900 shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 h-px bg-tertiary-300" />
      </div>

      <h2 className="heading-h2 font-display font-normal text-secondary-900 text-center">
        {t('title')}
      </h2>

      <div className="flex flex-col gap-8 w-full">
        {QUIZ_RESULTS_FOOTER_BENEFITS.map((benefit) => (
          <div
            key={benefit.titleKey}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex flex-row gap-2 items-center justify-center">
              <AlertSuccessIcon
                className="size-5 text-secondary-600 shrink-0 self-center"
                aria-hidden="true"
              />
              <h3 className="heading-h4 font-display font-normal text-secondary-900 text-center self-center">
                {t(benefit.titleKey)}
              </h3>
            </div>
            <p className="text-body-m font-sans text-secondary-950 text-center">
              {t(benefit.descriptionKey, { name: dogName })}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center gap-6">
        <div className="flex-1 h-px bg-tertiary-300" />
        <Garlic2Icon
          className="size-15 text-tertiary-900 shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1 h-px bg-tertiary-300" />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-body-m font-sans text-secondary-950">
          {t('moreBuddies.text')}{' '}
          <Link
            href={getQuizStepPath(QuizStep.Welcome)}
            variant="secondary"
            size="small"
            onClick={handleQuizAgainClick}
          >
            {t('moreBuddies.linkText')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export { QuizResultsFooter }
