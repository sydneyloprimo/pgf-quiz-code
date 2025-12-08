import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'

import { QuizFormData } from '@/components/quiz/QuizLayout'
import {
  MEALTIME_BEHAVIOR_OPTIONS,
  QUIZ_RESULTS_ILLUSTRATION_HEIGHT,
  QUIZ_RESULTS_ILLUSTRATION_WIDTH,
  TREAT_FREQUENCY_OPTIONS,
} from '@/constants'
import { cn } from '@/utils/cn'
import { getTranslatedOptions } from '@/utils/helpers'

interface QuizResultsHeaderProps {
  formData: QuizFormData
}

const QuizResultsHeader = ({ formData }: QuizResultsHeaderProps) => {
  const t = useTranslations('Quiz.resultsHeader')
  const tDiet = useTranslations('Quiz.diet')
  const locale = useLocale()

  const name = formData.name || ''
  const age = formData.age || ''
  const breed = formData.breed || ''
  const mealtimeBehavior = formData.mealtimeBehavior || ''
  const treatFrequency = formData.treatFrequency || ''

  const translatedMealtimeBehaviorOptions = getTranslatedOptions(
    MEALTIME_BEHAVIOR_OPTIONS,
    tDiet
  )
  const translatedTreatFrequencyOptions = getTranslatedOptions(
    TREAT_FREQUENCY_OPTIONS,
    tDiet
  )

  const mealtimeBehaviorLabel =
    translatedMealtimeBehaviorOptions.find(
      (option) => option.value === mealtimeBehavior
    )?.label || tDiet('options.goodEater')

  const treatFrequencyLabel =
    translatedTreatFrequencyOptions.find(
      (option) => option.value === treatFrequency
    )?.label || tDiet('options.several')

  const ageText =
    locale === 'es'
      ? `${t('agePrefix')} ${age} ${t('ageSuffix')}`
      : `${age}-year-old`

  return (
    <div
      className={cn(
        'flex flex-col gap-6 items-center',
        'text-center w-full',
        'text-secondary-950'
      )}
    >
      <div className="relative shrink-0">
        <Image
          src="/images/quiz-results-illustration.svg"
          alt={t('imageAlt')}
          width={QUIZ_RESULTS_ILLUSTRATION_WIDTH}
          height={QUIZ_RESULTS_ILLUSTRATION_HEIGHT}
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col gap-4 items-center w-full">
        <h2
          className={cn(
            'font-display',
            'text-4xl leading-12 tracking-tight',
            'w-full'
          )}
        >
          {t('headingPrefix', { name })}
        </h2>
        <p className={cn('font-body text-xl leading-8', 'w-full')}>
          {t('descriptionPrefix')} <span className="font-bold">{name}</span>{' '}
          {t('descriptionIs')} <span className="font-bold">{ageText}</span>{' '}
          <span className="font-bold">{breed || t('defaultBreed')}</span>{' '}
          {t('descriptionWho')}{' '}
          <span className="font-bold">{mealtimeBehaviorLabel}</span>{' '}
          {t('descriptionAnd')}{' '}
          <span className="font-bold">{treatFrequencyLabel}</span>{' '}
          {t('descriptionSuffix')}
        </p>
      </div>
    </div>
  )
}

export { QuizResultsHeader }
