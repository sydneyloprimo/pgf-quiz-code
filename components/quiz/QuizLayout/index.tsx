'use client'

import { useState, useCallback } from 'react'

import { QuizHeader } from '@/components/quiz/QuizHeader'
import { QuizStep } from '@/types/enums/constants'

interface QuizLayoutProps {
  renderStep: (
    currentStep: QuizStep,
    goToStep: (step: QuizStep) => void,
    goBack: () => void,
    canGoBack: boolean
  ) => React.ReactNode
}

const QuizLayout = ({ renderStep }: QuizLayoutProps) => {
  const [currentStep, setCurrentStep] = useState<QuizStep>(QuizStep.Welcome)
  const [stepHistory, setStepHistory] = useState<QuizStep[]>([QuizStep.Welcome])

  const goToStep = useCallback((step: QuizStep) => {
    setCurrentStep(step)
    setStepHistory((prev) => [...prev, step])
  }, [])

  const goBack = useCallback(() => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory]
      newHistory.pop()
      const previousStep = newHistory[newHistory.length - 1]
      setCurrentStep(previousStep)
      setStepHistory(newHistory)
    }
  }, [stepHistory])

  const canGoBack = stepHistory.length > 1

  return (
    <div className="flex flex-col min-h-screen bg-neutral-300 w-full py-10 px-5 md:px-24">
      <QuizHeader visitedSteps={stepHistory.length} />

      <main className="flex-1 flex max-w-2xl mx-auto items-center justify-center px-0">
        {renderStep(currentStep, goToStep, goBack, canGoBack)}
      </main>
    </div>
  )
}

export default QuizLayout
