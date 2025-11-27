'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/common/Button'
import { ArrowLeftIcon } from '@/components/common/Icon'
import { QuizStep1, QuizStep2 } from '@/components/quiz'
import QuizLayout from '@/components/quiz/QuizLayout'
import { cn } from '@/utils/cn'

export default function QuizPage() {
  const t = useTranslations('Quiz')
  const [stepNumber, setStepNumber] = useState(1)
  const [answers, setAnswers] = useState<Record<number, unknown>>({})

  const handleNext = () => {
    setStepNumber((prev) => prev + 1)
  }

  const handleBack = () => {
    setStepNumber((prev) => Math.max(1, prev - 1))
  }

  const renderStep = () => {
    switch (stepNumber) {
      case 1:
        return <QuizStep1 onNext={handleNext} />
      case 2:
        return <QuizStep2 onNext={handleNext} />
      default:
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <p>Step number: {stepNumber}</p>
          </div>
        )
    }
  }

  return (
    <QuizLayout stepNumber={stepNumber}>
      <div className="flex flex-col items-center w-full">
        {renderStep()}
        {stepNumber > 1 && (
          <div
            className={cn(
              'flex items-center justify-between gap-4',
              'w-full max-w-2xl mt-8'
            )}
          >
            <Button
              type="button"
              onClick={handleBack}
              data-qa="quiz-back-button"
              variant="tertiary"
              leftIcon={<ArrowLeftIcon className="size-3" />}
            >
              {t('backButton')}
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              data-qa="quiz-continue-button"
              variant="primary"
              className="min-w-64"
            >
              {t('continueButton')}
            </Button>
          </div>
        )}
      </div>
    </QuizLayout>
  )
}
