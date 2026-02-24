'use client'

import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

import {
  QuizStep1,
  QuizStep2,
  QuizConfirmationBeta,
  QuizLocation,
  QuizNeuteredStatus,
  QuizBreedSelection,
  QuizBodyShape,
  QuizDiet,
  QuizHowActive,
  QuizPlus25Lbs,
  QuizResults,
  QuizResultsBeta,
  QuizStepUnderAge,
  QuizSubscriptionType,
} from '@/components/quiz'
import QuizLayout, { QuizFormData } from '@/components/quiz/QuizLayout'
import { QuizStep } from '@/types/enums/constants'

export default function QuizStepPage() {
  const renderStep = useCallback(
    (
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
        case QuizStep.Location:
          return (
            <QuizLocation
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
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
        case QuizStep.NeuteredStatus:
          return (
            <QuizNeuteredStatus
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.BreedSelection:
          return (
            <QuizBreedSelection
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.Step5:
          return (
            <QuizBodyShape
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.Step6:
          return (
            <QuizDiet
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.Step7:
          return (
            <QuizHowActive
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.SubscriptionType:
          return (
            <QuizSubscriptionType
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.Results:
          return (
            <QuizResults
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.ResultsBeta:
          return (
            <QuizResultsBeta
              goToStep={goToStep}
              goBack={goBack}
              canGoBack={canGoBack}
              formMethods={formMethods}
            />
          )
        case QuizStep.ConfirmationBeta:
          return (
            <QuizConfirmationBeta
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
        default:
          return (
            <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
              <p>Step: {currentStep}</p>
            </div>
          )
      }
    },
    []
  )

  return <QuizLayout renderStep={renderStep} />
}
