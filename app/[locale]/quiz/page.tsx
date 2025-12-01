'use client'

import {
  QuizStep1,
  QuizStep2,
  QuizStep3,
  QuizStepUnderAge,
} from '@/components/quiz'
import QuizLayout from '@/components/quiz/QuizLayout'
import { QuizPlus25Lbs } from '@/components/quiz/QuizPlus25Lbs'
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
      case QuizStep.Plus25Lbs:
        return (
          <QuizPlus25Lbs
            goToStep={goToStep}
            goBack={goBack}
            canGoBack={canGoBack}
          />
        )
      case QuizStep.UnderAge:
        return (
          <QuizStepUnderAge
            goToStep={goToStep}
            goBack={goBack}
            canGoBack={canGoBack}
          />
        )
      case QuizStep.Step3:
        return (
          <QuizStep3
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
