'use client'

import { useState } from 'react'

import QuizLayout from '@/components/quiz/QuizLayout'
import { QuizStep1 } from '@/components/quiz/QuizStep1'
import { QuizStep2 } from '@/components/quiz/QuizStep2'
import { QuizStep3 } from '@/components/quiz/QuizStep3'

export default function QuizPage() {
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
        return <QuizStep2 onNext={handleNext} onBack={handleBack} />
      case 3:
        return <QuizStep3 onNext={handleNext} onBack={handleBack} />
      default:
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <p>Step number: {stepNumber}</p>
          </div>
        )
    }
  }

  return (
    <QuizLayout stepNumber={stepNumber} onNext={handleNext} onBack={handleBack}>
      {renderStep()}
    </QuizLayout>
  )
}
