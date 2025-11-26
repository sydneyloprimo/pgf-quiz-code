'use client'

import QuizLayout from '@/components/quiz/QuizLayout'
import { QuizStep1 } from '@/components/quiz/QuizStep1'
import { QuizStep2 } from '@/components/quiz/QuizStep2'
import { QuizStep } from '@/types/enums/constants'

export default function QuizPage() {
  const renderStep = (
    currentStep: QuizStep,
    goToStep: (step: QuizStep) => void,
    goBack: () => void,
    canGoBack: boolean
  ) => {
    switch (currentStep) {
      case QuizStep.Welcome:
        return (
          <QuizStep1
            goToStep={goToStep}
            goBack={goBack}
            canGoBack={canGoBack}
          />
        )
      case QuizStep.PetInfo:
        return (
          <QuizStep2
            goToStep={goToStep}
            goBack={goBack}
            canGoBack={canGoBack}
          />
        )
      default:
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <p>Step: {currentStep}</p>
          </div>
        )
    }
  }

  return <QuizLayout renderStep={renderStep} />
}
