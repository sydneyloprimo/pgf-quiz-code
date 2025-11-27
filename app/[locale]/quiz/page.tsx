'use client'

import { UseFormReturn } from 'react-hook-form'

import { QuizStep1, QuizStep2, QuizStep3 } from '@/components/quiz'
import QuizLayout, { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizStep } from '@/types/enums/constants'

export default function QuizPage() {
  const renderStep = (
    currentStep: QuizStep,
    goToStep: (step: QuizStep) => void,
    goBack: () => void,
    canGoBack: boolean,
    formMethods: UseFormReturn<QuizFormData>
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
            formMethods={formMethods}
          />
        )
      case QuizStep.Step3:
        return (
          <QuizStep3
            goToStep={goToStep}
            goBack={goBack}
            canGoBack={canGoBack}
            formMethods={formMethods}
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
