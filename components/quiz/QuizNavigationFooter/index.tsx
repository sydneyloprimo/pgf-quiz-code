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
  continueDisabled?: boolean
}

const QuizNavigationFooter = ({
  goBack,
  canGoBack,
  onContinue,
  continueButtonText,
  continueDisabled = false,
}: QuizNavigationFooterProps) => {
  const t = useTranslations('Quiz')

  if (!canGoBack) {
    return (
      <div className="flex flex-col gap-8 items-center w-full">
        <Button
          variant="primary"
          className="max-w-sm w-full"
          onClick={onContinue}
          disabled={continueDisabled}
        >
          {continueButtonText}
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        'md:flex-row md:justify-between',
        'max-w-2xl w-full md:w-auto'
      )}
    >
      <Button
        type="button"
        onClick={goBack}
        data-qa="quiz-back-button"
        variant="tertiary"
        leftIcon={<ArrowLeftIcon className="size-3" />}
        className="order-2 md:order-1 w-full md:w-auto"
      >
        {t('backButton')}
      </Button>
      <Button
        type="button"
        onClick={onContinue}
        data-qa="quiz-continue-button"
        variant="primary"
        className="order-1 md:order-2 w-full md:w-auto md:min-w-64"
        disabled={continueDisabled}
      >
        {continueButtonText}
      </Button>
    </div>
  )
}

export { QuizNavigationFooter }
