'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Link } from '@/components/common/Link'
import { QuizNavigationFooter } from '@/components/quiz/QuizNavigationFooter'
import {
  QUIZ_DOG_ILLUSTRATION_HEIGHT,
  QUIZ_DOG_ILLUSTRATION_WIDTH,
} from '@/constants'
import { useConciergeContact } from '@/hooks/useConciergeContact'
import { QuizStep } from '@/types/enums/constants'
import { cn } from '@/utils/cn'

interface QuizStep1Props {
  goToStep: (step: QuizStep) => void
  goBack: () => void
  canGoBack: boolean
}

const QuizStep1 = ({ goToStep, goBack, canGoBack }: QuizStep1Props) => {
  const t = useTranslations('Quiz.step1')
  const tConcierge = useTranslations('Common.ConciergeLink')
  const { href: conciergeHref, isTabletOrLarger } = useConciergeContact()

  const handleNext = () => {
    goToStep(QuizStep.PetInfo)
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center', 'pt-0 w-full')}
    >
      <div className="flex flex-col gap-4 items-center w-full pb-[60px]">
        <div className="relative shrink-0">
          <Image
            src="/images/quiz-dog-illustration.png"
            alt={t('imageAlt')}
            width={QUIZ_DOG_ILLUSTRATION_WIDTH}
            height={QUIZ_DOG_ILLUSTRATION_HEIGHT}
            className="object-contain"
            priority
          />
        </div>
        <div
          className={cn(
            'flex flex-col gap-6 items-center',
            'max-w-[700px] text-center w-full',
            'text-secondary-950'
          )}
        >
          <h2
            className={cn(
              'font-display',
              'text-4xl leading-12 tracking-tight',
              'w-full'
            )}
          >
            {t('heading')}
          </h2>
          <p className={cn('font-body text-lg leading-8', 'w-full')}>
            {t('description')}
          </p>
        </div>
      </div>
      <QuizNavigationFooter
        goBack={goBack}
        canGoBack={canGoBack}
        onContinue={handleNext}
        continueButtonText={t('button')}
      />
      <Link
        href={conciergeHref}
        aria-label={
          isTabletOrLarger
            ? tConcierge('emailAriaLabel')
            : tConcierge('phoneAriaLabel')
        }
        className="text-secondary-900 mt-8"
      >
        {t('link')}
      </Link>
    </div>
  )
}

export { QuizStep1 }
