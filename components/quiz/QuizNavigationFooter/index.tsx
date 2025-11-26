'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon } from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface QuizNavigationFooterProps {
  goBack: () => void
  canGoBack: boolean
  onContinue: () => void
  continueButtonText: string
}

const QuizNavigationFooter = ({
  goBack,
  canGoBack,
  onContinue,
  continueButtonText,
}: QuizNavigationFooterProps) => {
  const t = useTranslations('Quiz')

  if (!canGoBack) {
    return (
      <div className="flex flex-col gap-8 items-center w-full">
        <Button
          variant="primary"
          className="max-w-sm w-full"
          onClick={onContinue}
        >
          {continueButtonText}
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        'max-w-2xl mt-8'
      )}
    >
      <Button
        type="button"
        onClick={goBack}
        data-qa="quiz-back-button"
        variant="tertiary"
        leftIcon={<ArrowLeftIcon className="size-3" />}
      >
        {t('backButton')}
      </Button>
      <Button
        type="button"
        onClick={onContinue}
        data-qa="quiz-continue-button"
        variant="primary"
        className="min-w-64"
      >
        {continueButtonText}
      </Button>
    </div>
  )
}

export { QuizNavigationFooter }
