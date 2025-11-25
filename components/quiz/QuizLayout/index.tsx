'use client'

import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon } from '@/components/common/Icon'
import { QuizHeader } from '@/components/quiz/QuizHeader'
import { cn } from '@/utils/cn'

interface QuizLayoutProps extends PropsWithChildren {
  stepNumber: number
  onNext: () => void
  onBack: () => void
}

const QuizLayout = ({
  children,
  stepNumber,
  onNext,
  onBack,
}: QuizLayoutProps) => {
  const t = useTranslations('Quiz')

  const TOTAL_STEPS = 8

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full py-10 px-5 md:px-24">
      <QuizHeader currentStep={stepNumber} totalSteps={TOTAL_STEPS} />

      <main className="flex-1 flex items-center justify-center px-0">
        {children}
      </main>

      {stepNumber > 1 && (
        <footer
          className={cn(
            'flex items-center justify-between gap-4',
            'px-5 sm:px-24 py-5',
            'bg-neutral-300 border-t border-neutral-600'
          )}
        >
          <Button
            type="button"
            onClick={onBack}
            data-qa="quiz-back-button"
            variant="tertiary"
            leftIcon={<ArrowLeftIcon className="size-3" />}
          >
            {t('backButton')}
          </Button>
          <Button
            type="button"
            onClick={onNext}
            data-qa="quiz-continue-button"
            variant="primary"
          >
            {t('continueButton')}
          </Button>
        </footer>
      )}
    </div>
  )
}

export default QuizLayout
